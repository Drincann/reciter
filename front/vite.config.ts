import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: path.join(__dirname, '../dist/public'),
    watch: {
      include: [
        path.join(__dirname, '../src')
      ]
    }
  },
  server: {
    proxy: {
      '/': {
        target: 'http://localhost:80',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '')
      }
    },
    port: 3000
  }
})
