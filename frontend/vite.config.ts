import { fileURLToPath, URL } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
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
        content: 'src/main.ts',               
        background: 'src/background/background.js',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') {
            return 'main.js';                   
          }
          if (chunkInfo.name === 'background') {
            return 'background/background.js';
          }
          return '[name].js';
        },
      },
      external: []
    },
  },
})
