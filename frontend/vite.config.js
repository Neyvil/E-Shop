import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://e-shopbackend-bnov.onrender.com",
        changeOrigin: true, // Ensure the host header is adjusted to the target
        rewrite: (path) => path.replace(/^\/api/, ""), // Remove "/api" prefix when sending to the backend
      },
    },
  },
});
