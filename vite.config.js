import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'src', // Set the root directory where Vite should look for files
  build: {
    outDir: '../dist', // Output directory after building the project
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  publicDir: '../public',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
