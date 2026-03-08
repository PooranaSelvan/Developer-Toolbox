import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.zcodecorp.in',
    ],
    hmr: {
      host: 'pooranak-6k593jeb-5173.zcodecorp.in',
      protocol: 'wss',
    },
  },
});
