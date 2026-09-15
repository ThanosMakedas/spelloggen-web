import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The API only lets this origin through CORS. strictPort makes Vite stop with an
    // error if 5173 is taken, instead of quietly moving to 5174 where every request fails.
    port: 5173,
    strictPort: true,
  },
})
