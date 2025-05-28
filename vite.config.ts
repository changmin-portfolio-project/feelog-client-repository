import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // React 18 자동 리프레시 지원
      fastRefresh: true,
    }),
    // PWA 및 Service Worker 설정 (기존 Workbox 설정 이식)
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'manifest.json'],
      manifest: {
        name: 'Feelog - 지도 기반 수집 소셜미디어',
        short_name: 'Feelog',
        description: '위치 기반 소셜 플랫폼',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'assets/images/icon/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/images/icon/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],

  // 경로 별칭 설정 (기존 import 경로 유지)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      App: path.resolve(__dirname, './src/App'),
      components: path.resolve(__dirname, './src/components'),
      services: path.resolve(__dirname, './src/services'),
      hook: path.resolve(__dirname, './src/hook'),
      global: path.resolve(__dirname, './src/global'),
      const: path.resolve(__dirname, './src/const'),
      states: path.resolve(__dirname, './src/states'),
      pages: path.resolve(__dirname, './src/pages'),
      styles: path.resolve(__dirname, './src/styles'),
      assets: path.resolve(__dirname, './src/assets'),
      config: path.resolve(__dirname, './src/config'),
    },
  },

  // 개발 서버 설정
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },

  // 빌드 설정
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        // 청크 분할 최적화
        manualChunks: {
          // React 관련 라이브러리
          vendor: ['react', 'react-dom'],
          // 라우팅
          router: ['react-router-dom'],
          // 상태 관리
          state: ['recoil', '@tanstack/react-query'],
          // 지도 관련
          maps: ['mapkit'],
          // 스타일링
          styling: ['styled-components', 'framer-motion'],
          // 유틸리티
          utils: ['lodash', 'date-fns', 'axios'],
        },
      },
    },
    // 청크 크기 경고 임계값 설정
    chunkSizeWarningLimit: 1000,
  },

  // 환경 변수 설정
  define: {
    // 프로덕션에서 console.log 제거 (기존 Craco 설정과 동일)
    ...(process.env.NODE_ENV === 'production' && {
      'console.log': '(() => {})',
      'console.info': '(() => {})',
      'console.debug': '(() => {})',
    }),
  },

  // CSS 설정
  css: {
    preprocessorOptions: {
      scss: {
        // Dart Sass 사용 (기존 설정과 동일)
        implementation: require('sass'),
        additionalData: `@import "./src/styles/theme.ts";`,
      },
    },
  },

  // 최적화 설정
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recoil',
      '@tanstack/react-query',
      'styled-components',
      'framer-motion',
      'mapkit',
    ],
  },
});
