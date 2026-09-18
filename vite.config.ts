import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { expertsApi } from './server/api.js'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/trading-website/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'experts-api',
      configureServer(server) {
        server.middlewares.use('/api', expertsApi() as never)
      },
      configurePreviewServer(server) {
        server.middlewares.use('/api', expertsApi() as never)
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 45217,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 45217,
    strictPort: true,
  },
})
