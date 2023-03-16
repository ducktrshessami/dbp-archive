import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import compression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), compression()],
  server: {
    proxy: {
      "/api": "http://localhost:3001",
      "/attachments": "http://localhost:3001",
      "/avatars": "http://localhost:3001",
      "/emojis": "http://localhost:3001",
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
