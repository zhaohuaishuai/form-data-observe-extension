import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000
  },
  createHtmlPlugin:{
    minify:true,
    pages:[

    ]
  }
})
