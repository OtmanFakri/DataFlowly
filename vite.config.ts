import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React and core libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],

          // UI components and icons
          ui: ['lucide-react'],

          // Large libraries (adjust based on what you're using)
          google: ['@google/genai'],

          // Other heavy dependencies you might have
          // charts: ['recharts', 'chart.js'],
          // utils: ['lodash', 'date-fns'],
        }
      }
    },
    // Increase warning limit to 600KB (optional)
    chunkSizeWarningLimit: 600
  }
});