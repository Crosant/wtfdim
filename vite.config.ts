import { defineConfig } from 'vite';

// Using relative base path so the build works out-of-the-box on GitHub Pages
// regardless of whether it's hosted at root or on a project subpath.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: false,
  }
});
