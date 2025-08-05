import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: []
    }
  },
  resolve: {
    alias: {
      'gridstack': resolve(__dirname, 'node_modules/gridstack')
    }
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import "gridstack/dist/gridstack.min.css";`
      }
    }
  }
}); 