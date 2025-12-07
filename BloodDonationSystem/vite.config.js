import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Có thể đặt port bạn muốn
    proxy: {
      // Mọi request đến /api sẽ được chuyển tiếp đến backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: true
      },
      '/email': { // Thêm dòng này để proxy email API
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
