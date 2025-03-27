import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		electron([
			{
				// Main process entry point
				entry: 'electron/main.ts',
				vite: {
					build: {
						outDir: 'dist-electron',
						rollupOptions: {
							external: ['electron'],
							output: {
								format: 'cjs'
							}
						}
					}
				}
			},
			{
				entry: 'electron/preload.ts',
				onstart(options) {
					options.reload();
				},
				vite: {
					build: {
						outDir: 'dist-electron',
						rollupOptions: {
							external: ['electron'],
							output: {
								format: 'cjs',
								entryFileNames: 'preload.cjs'
							}
						},
						minify: false,
						sourcemap: false
					},
					esbuild: {
						loader: 'js'
					}
				}
			}
		]),
		renderer()
	],
	base: './',
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
	optimizeDeps: {
		exclude: ['lucide-react'],
	},
});
