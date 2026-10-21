import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // During backend development, uncomment to proxy API calls to Express server
      // '/api': {
      //   target: 'http://localhost:5000',
      //   changeOrigin: true,
      // },
    },
  },
});
