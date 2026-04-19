import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ajuste o base para o nome do seu repositório se for usar GitHub Pages
  base: '/stackflow/',
  build: {
    minify: 'esbuild',
  }
})
