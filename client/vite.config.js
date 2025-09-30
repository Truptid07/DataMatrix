import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'tailwindcss',
      'postcss',
      'autoprefixer'
    ]
  },
  build: {
    sourcemap: false,
    outDir: 'dist'
  },
  css: {
    postcss: './postcss.config.js'
  }
})
