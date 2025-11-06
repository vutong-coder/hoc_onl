import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    server: {
        port: 4173,
        host: true,
        open: false,
        strictPort: true,
        proxy: {
            // Proxy API requests to avoid CORS issues
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
                // Removed rewrite since backend uses /api/v1/auth paths
            }
        }
    },
    preview: {
        port: 4173,
        host: true,
        strictPort: true,
        proxy: {
            // Proxy API requests to avoid CORS issues
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            }
        }
    },
});
