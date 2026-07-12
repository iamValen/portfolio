import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const git = (cmd: string, fallback: string) => {
  try { return execSync(`git ${cmd}`).toString().trim() }
  catch { return fallback }
}

// APP_VERSION/APP_DATE can be passed in at build time (docker, ci) where there
// is no .git to read. fall back to git locally, then to a sane default.
const APP_VERSION = process.env.APP_VERSION || git('describe --tags --always --dirty', 'dev')
const APP_DATE    = process.env.APP_DATE || git('log -1 --format=%cI', new Date().toISOString())

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared/src', import.meta.url)),
    },
  },
  server: {
    // notes api runs separately in dev; proxy /api to it so the browser sees
    // one origin (same as behind caddy in prod)
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __APP_DATE__:    JSON.stringify(APP_DATE),
  },
})
