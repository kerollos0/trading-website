import cookieParser from 'cookie-parser'
import crypto from 'node:crypto'
import express from 'express'
import { persistImage, readStore, writeStore } from './store.js'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shady@2026'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'shady-desk-change-this-secret'

function signSession() {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000
  const payload = String(exp)
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex')
  return `${payload}.${sig}`
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function isAuthed(req) {
  const token = req.cookies?.shady_admin
  if (!token || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex')
  if (!safeEqual(sig, expected)) return false
  return Number(payload) > Date.now()
}

function requireAuth(req, res, next) {
  if (!isAuthed(req)) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }
  next()
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: Boolean(process.env.VERCEL),
  }
}

function cleanExpert(input, previous) {
  const title = String(input.title || '').trim()
  const description = String(input.description || '').trim()
  const link = String(input.link || '').trim()
  const image = String(input.image || '').trim()

  if (!title || title.length > 120) {
    throw new Error('invalid_title')
  }
  if (!description || description.length > 2000) {
    throw new Error('invalid_description')
  }
  if (link && !/^https?:\/\//i.test(link)) {
    throw new Error('invalid_link')
  }
  if (image && !image.startsWith('data:image/') && !image.startsWith('https://')) {
    throw new Error('invalid_image')
  }
  if (image.startsWith('data:image/') && image.length > 1_400_000) {
    throw new Error('image_too_large')
  }

  return {
    id: previous?.id || crypto.randomUUID(),
    title,
    description,
    link,
    image,
    createdAt: previous?.createdAt || new Date().toISOString(),
  }
}

function sendJson(res, body, status = 200) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(status).json(body)
}

function attachRoutes(router) {
  router.get('/experts', async (_req, res) => {
    try {
      sendJson(res, await readStore())
    } catch {
      sendJson(res, { error: 'store_failed' }, 500)
    }
  })

  router.get('/session', (req, res) => {
    sendJson(res, { ok: isAuthed(req) })
  })

  router.post('/login', (req, res) => {
    const username = String(req.body?.username || '')
    const password = String(req.body?.password || '')
    if (!safeEqual(username, ADMIN_USER) || !safeEqual(password, ADMIN_PASSWORD)) {
      sendJson(res, { error: 'invalid_credentials' }, 401)
      return
    }
    res.cookie('shady_admin', signSession(), cookieOptions())
    sendJson(res, { ok: true })
  })

  router.post('/logout', (_req, res) => {
    res.clearCookie('shady_admin', { path: '/' })
    sendJson(res, { ok: true })
  })

  router.post('/experts', requireAuth, async (req, res) => {
    try {
      const store = await readStore()
      const expert = cleanExpert(req.body)
      expert.image = await persistImage(expert.image, expert.id)
      store.experts.unshift(expert)
      await writeStore(store)
      sendJson(res, { expert })
    } catch (error) {
      sendJson(res, { error: error instanceof Error ? error.message : 'invalid' }, 400)
    }
  })

  router.put('/experts/:id', requireAuth, async (req, res) => {
    try {
      const store = await readStore()
      const index = store.experts.findIndex((item) => item.id === req.params.id)
      if (index === -1) {
        sendJson(res, { error: 'not_found' }, 404)
        return
      }
      const expert = cleanExpert(req.body, store.experts[index])
      expert.image = await persistImage(expert.image, expert.id)
      store.experts[index] = expert
      await writeStore(store)
      sendJson(res, { expert })
    } catch (error) {
      sendJson(res, { error: error instanceof Error ? error.message : 'invalid' }, 400)
    }
  })

  router.delete('/experts/:id', requireAuth, async (req, res) => {
    try {
      const store = await readStore()
      const next = store.experts.filter((item) => item.id !== req.params.id)
      if (next.length === store.experts.length) {
        sendJson(res, { error: 'not_found' }, 404)
        return
      }
      await writeStore({ experts: next })
      sendJson(res, { ok: true })
    } catch {
      sendJson(res, { error: 'store_failed' }, 500)
    }
  })
}

export function expertsApi() {
  const app = express()
  app.use(express.json({ limit: '3mb' }))
  app.use(cookieParser())
  attachRoutes(app)
  const prefixed = express.Router()
  attachRoutes(prefixed)
  app.use('/api', prefixed)
  return app
}
