import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',  // Specify the root directory if needed
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});