import { defineConfig } from 'vite'
import { resolve } from 'path'

// Demo-only vite config. Kept separate from any library build config so the
// published artifact is unaffected by how the demo page is bundled.
export default defineConfig({
  root: 'demo',
  base: './',
  // No source alias: this library resolves from node_modules, so the demo
  // exercises the published tarball rather than the working tree.

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
})
