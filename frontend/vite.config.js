import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:'/',
  server: {
    proxy: {
      "/api/": {
        target: "https://e-shopbackend-bnov.onrender.com",
        changeOrigin: true, // Ensure the host header is adjusted to the target
      },
    },
  },
});
