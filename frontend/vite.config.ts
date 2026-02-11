import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Fix for SockJS "global is not defined" error
  // Vite doesn't polyfill Node.js globals, so we map global to window
  // After changing this, restart dev server: Ctrl+C then npm run dev
  define: {
    global: 'window',
  },
})
