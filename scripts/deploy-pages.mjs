import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const work = '/tmp/gh-pages-deploy'

execSync('npm run build', {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true' },
})

fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'))
fs.rmSync(work, { recursive: true, force: true })
fs.cpSync(dist, work, { recursive: true })

execSync('git init', { cwd: work, stdio: 'inherit' })
execSync('git checkout -b gh-pages', { cwd: work, stdio: 'inherit' })
execSync('git add -A', { cwd: work, stdio: 'inherit' })
execSync('git -c user.name="kerollos0" -c user.email="kerozaher888@gmail.com" commit -m "Deploy Shady landing page to GitHub Pages"', {
  cwd: work,
  stdio: 'inherit',
})
execSync('git remote add origin https://github.com/kerollos0/trading-website.git', {
  cwd: work,
  stdio: 'inherit',
})
execSync('git push -f origin gh-pages', { cwd: work, stdio: 'inherit' })
