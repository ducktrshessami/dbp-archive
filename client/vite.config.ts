import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
      "/attachment": "http://localhost:3001",
      "/avatar": "http://localhost:3001",
      "/emoji": "http://localhost:3001",
      "/users.css": "http://localhost:3001",
      "/emojis.css": "http://localhost:3001"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          highlight: ["highlight.js"]
        }
      }
    }
  }
})
