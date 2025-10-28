import { fileURLToPath, URL } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteStaticCopy({
     targets: [
       {
         src: 'src/background/background.js', 
         dest: 'background',
       },
       {
         src: 'public/manifest.json',
         dest: ''
       }
     ],
   })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'index.html',
      },
    },
    minify: false,
  },
})