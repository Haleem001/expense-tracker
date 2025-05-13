
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Typical Vite dev server port
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000
  }
})
