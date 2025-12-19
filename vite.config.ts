
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // crucial for GitHub Pages and WebIntoApp
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
  define: {
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  }
});
