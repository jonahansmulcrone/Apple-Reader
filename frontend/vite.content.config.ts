import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': {},
  },
  build: {
    lib: {
      entry: 'src/content.ts',
      name: 'ContentScript',
      fileName: () => 'content.js',
      formats: ['iife']
    },
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
})