import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  base: './', // This is good for IPFS deployment
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: undefined, // Disable code splitting for better IPFS compatibility
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    assetsDir: 'assets', // Explicitly set assets directory
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    sourcemap: false, // Disable sourcemaps for production
    minify: 'terser', // Use Terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Add this if you want to use @ as an alias for your src directory
    },