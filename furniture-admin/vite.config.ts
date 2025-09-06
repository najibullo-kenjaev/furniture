import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,        // самоподписанный сертификат
        rewrite: p => p.replace(/^\/api/, '/api')
      }
    }
  }
})