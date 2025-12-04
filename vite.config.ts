// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: "esnext",

    terserOptions: JSON.parse(
      JSON.stringify({
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      })
    ),
  }
})