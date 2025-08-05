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
      external: [],
      output: {
        format: 'es',
        entryFileNames: '[name].[hash].mjs',
        chunkFileNames: '[name].[hash].mjs',
        assetFileNames: '[name].[hash].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      'gridstack': resolve(__dirname, 'node_modules/gridstack')
    }
  },
  optimizeDeps: {
    include: ['gridstack']
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  json: {
    stringify: true
  }
}); 