import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Comentado para funcionar no Vercel/Netlify (que usam a raiz /)
  // base: '/stackflow/',
  build: {
    minify: 'esbuild',
    reportCompressedSize: false,
  }
})
