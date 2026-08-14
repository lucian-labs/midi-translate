import { defineConfig } from 'vite'
import { resolve } from 'path'

// Demo-only vite config. Kept separate from any library build config so the
// published artifact is unaffected by how the demo page is bundled.
export default defineConfig({
  root: 'demo',
  base: './',

  resolve: {
    // The demo exercises the working tree, not the last published tarball, so
    // the deployed page always shows the behaviour of the code in this repo.
    alias: {
      'midi-translate': resolve(__dirname, 'src/index.mjs'),
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    // The implementation is CommonJS; vite only transforms CJS under
    // node_modules by default, and the alias above points outside it.
    commonjsOptions: {
      include: [/node_modules/, /src\/index\.js$/],
    },
  },
})
