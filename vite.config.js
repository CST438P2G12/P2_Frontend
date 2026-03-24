import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://p2-backend-7wbr.onrender.com/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/oauth2': {
                target: 'https://p2-backend-7wbr.onrender.com/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/oauth2/, '')
            },
            '/login': {
                target: 'https://p2-backend-7wbr.onrender.com/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/login/, '')
            },
        }
    }
})
