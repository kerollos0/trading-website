import cookieParser from 'cookie-parser'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataFile = path.join(rootDir, 'public', 'experts.json')

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Shady@2026'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'shady-desk-change-this-secret'

function readStore() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8')
    const parsed = JSON.parse(raw)
    return { experts: Array.isArray(parsed.experts) ? parsed.experts : [] }
  } catch {
    return { experts: [] }
  }
}

function writeStore(store) {
  fs.writeFileSync(dataFile, `${JSON.stringify(store, null, 2)}\n`)
}

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
  if (image && !image.startsWith('data:image/')) {
    throw new Error('invalid_image')
  }
  if (image.length > 1_400_000) {
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

export function expertsApi() {
  const app = express()
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())

  app.get('/experts', (_req, res) => {
    res.json(readStore())
  })

  app.get('/session', (req, res) => {
    res.json({ ok: isAuthed(req) })
  })

  app.post('/login', (req, res) => {
    const username = String(req.body?.username || '')
    const password = String(req.body?.password || '')
    if (!safeEqual(username, ADMIN_USER) || !safeEqual(password, ADMIN_PASSWORD)) {
      res.status(401).json({ error: 'invalid_credentials' })
      return
    }
    res.cookie('shady_admin', signSession(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    res.json({ ok: true })
  })

  app.post('/logout', (_req, res) => {
    res.clearCookie('shady_admin', { path: '/' })
    res.json({ ok: true })
  })

  app.post('/experts', requireAuth, (req, res) => {
    try {
      const store = readStore()
      const expert = cleanExpert(req.body)
      store.experts.unshift(expert)
      writeStore(store)
      res.json({ expert })
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'invalid' })
    }
  })

  app.put('/experts/:id', requireAuth, (req, res) => {
    try {
      const store = readStore()
      const index = store.experts.findIndex((item) => item.id === req.params.id)
      if (index === -1) {
        res.status(404).json({ error: 'not_found' })
        return
      }
      const expert = cleanExpert(req.body, store.experts[index])
      store.experts[index] = expert
      writeStore(store)
      res.json({ expert })
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'invalid' })
    }
  })

  app.delete('/experts/:id', requireAuth, (req, res) => {
    const store = readStore()
    const next = store.experts.filter((item) => item.id !== req.params.id)
    if (next.length === store.experts.length) {
      res.status(404).json({ error: 'not_found' })
      return
    }
    writeStore({ experts: next })
    res.json({ ok: true })
  })

  return app
}
