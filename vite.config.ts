import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Production hosts resolve `/templates/` to `/templates/index.html` automatically.
 * Vite's dev and preview servers do not, so the static SEO pages would fall back
 * to the SPA shell. This middleware makes local URLs behave exactly like the
 * deployed site.
 */
function prettyStaticPages(): Plugin {
  const resolve = (url: string, roots: string[]): string | null => {
    const clean = url.split('?')[0]
    if (!clean.endsWith('/') || clean === '/') return null
    for (const dir of roots) {
      try {
        if (fs.statSync(path.join(dir, clean, 'index.html')).isFile()) return `${clean}index.html`
      } catch {
        // not present in this root — try the next one
      }
    }
    return null
  }

  return {
    name: 'pretty-static-pages',
    configureServer(server) {
      const roots = [path.join(server.config.root, 'public')]
      server.middlewares.use((req, _res, next) => {
        const target = req.url ? resolve(req.url, roots) : null
        if (target) req.url = target
        next()
      })
    },
    configurePreviewServer(server) {
      const roots = [
        path.join(server.config.root, server.config.build.outDir),
        path.join(server.config.root, 'public'),
      ]
      server.middlewares.use((req, _res, next) => {
        const target = req.url ? resolve(req.url, roots) : null
        if (target) req.url = target
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), prettyStaticPages()],
})
