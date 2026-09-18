import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expertsApi } from './api.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(rootDir, 'dist')
const port = Number(process.env.PORT || 45217)

const app = express()
app.use('/api', expertsApi())
app.use(express.static(distDir))
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next()
    return
  }
  const indexPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    res.status(500).send('Build the app first with npm run build')
    return
  }
  res.sendFile(indexPath)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Shady desk running on http://127.0.0.1:${port}`)
})
