import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['electron-store', 'fs-extra']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/renderer/src'),
        '@types': path.resolve(__dirname, './src/renderer/src/types'),
        '@lib': path.resolve(__dirname, './src/renderer/src/lib'),
        '@components': path.resolve(__dirname, './src/renderer/src/components'),
      }
    },
    css: {
      postcss: './postcss.config.js'
    }
  }
});
