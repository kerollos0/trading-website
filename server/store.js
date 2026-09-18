import { list, put } from '@vercel/blob'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataFile = path.join(rootDir, 'public', 'experts.json')
const BLOB_KEY = 'experts.json'

function readLocal() {
  try {
    const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
    return { experts: Array.isArray(parsed.experts) ? parsed.experts : [] }
  } catch {
    return { experts: [] }
  }
}

function hasBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export async function readStore() {
  if (!hasBlob()) return readLocal()

  const { blobs } = await list({ prefix: BLOB_KEY, limit: 20 })
  const file = blobs.find((item) => item.pathname === BLOB_KEY) || blobs[0]
  if (file?.url) {
    const response = await fetch(file.url, { cache: 'no-store' })
    if (response.ok) {
      const parsed = await response.json()
      return { experts: Array.isArray(parsed.experts) ? parsed.experts : [] }
    }
  }

  const seed = readLocal()
  await writeStore(seed)
  return seed
}

export async function writeStore(store) {
  if (!hasBlob()) {
    fs.writeFileSync(dataFile, `${JSON.stringify(store, null, 2)}\n`)
    return
  }

  await put(BLOB_KEY, JSON.stringify(store, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  })
}

export async function persistImage(image, id) {
  const value = String(image || '').trim()
  if (!value) return ''
  if (value.startsWith('https://')) return value
  if (!value.startsWith('data:image/')) return ''
  if (!hasBlob()) return value

  const match = value.match(/^data:image\/([\w+.-]+);base64,(.+)$/)
  if (!match) return value
  const ext = match[1] === 'jpeg' ? 'jpg' : match[1].replace('svg+xml', 'svg')
  const blob = await put(`experts/${id}.${ext}`, Buffer.from(match[2], 'base64'), {
    access: 'public',
    addRandomSuffix: true,
  })
  return blob.url
}
