import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // bind 0.0.0.0 so the live preview proxy can reach the dev server
    port: 5173,
    allowedHosts: true, // accept requests from any host (live preview tunnels)
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
