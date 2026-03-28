import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Target modern browsers for smaller output
    target: 'es2020',

    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'vendor-react';
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'vendor-three';
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
        },
      },
    },

    // Inline assets < 8kb
    assetsInlineLimit: 8192,

    // CSS code splitting
    cssCodeSplit: true,

    // Source maps off for prod
    sourcemap: false,
  },
})
