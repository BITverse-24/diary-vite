import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron';
  
  return {
    plugins: [
      react(),
      isElectron && electron({
        entry: [
          'electron/main.ts',
          'electron/preload.ts'
        ],
      }),
      isElectron && renderer(),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      minify: false,
      outDir: 'dist',
      sourcemap: true
    },
    server: {
      port: 5173
    }
  };
});
