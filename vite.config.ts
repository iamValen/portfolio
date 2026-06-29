import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const git = (cmd: string, fallback: string) => {
  try { return execSync(`git ${cmd}`).toString().trim() }
  catch { return fallback }
}

const APP_VERSION = git('describe --tags --abbrev=0', 'dev')
const APP_DATE    = git('log -1 --format=%cI', new Date().toISOString())

export default defineConfig({
  plugins: [react()],
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(APP_VERSION),
    __APP_DATE__:    JSON.stringify(APP_DATE),
  },
})
