import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "https://e-shopbackend-bnov.onrender.com",
        changeOrigin: true, // Adjusts the host header to the target
        rewrite: (path) => path.replace(/^\/api\//, ""), // Correctly removes the "/api/" prefix when forwarding requests
      },
    },
  },
});
