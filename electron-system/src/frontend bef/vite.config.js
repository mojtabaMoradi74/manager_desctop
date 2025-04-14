// vite.config.js
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic', // یا 'automatic'
    }),
    // tailwindcss(),
  ],
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      //   overlay: false, // خطاهای HMR در مرورگر نمایش داده نشود
    },
    // proxy: {
    //   '/api': {
    // 	target: 'http://localhost:8000', // آدرس سرور بک‌اند
    // 	changeOrigin: true,
    // 	rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  esbuild: {
    loader: 'jsx', // 👈 همه فایل‌های .js به عنوان jsx پردازش بشن
    include: /src\/.*\.js$/, // فقط فایل‌های js داخل src,
    // jsx: 'react', // پشتیبانی از JSX برای React
    jsx: 'react-jsx', // پشتیبانی از JSX با React 17 به بالا
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
  },
})
// '@': path.resolve(__dirname, './src'), // حالا با @ می‌تونی از مسیر src استفاده کنی
// components: path.resolve(__dirname, './src/components'),
// utils: path.resolve(__dirname, './src/utils'),
