import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.min.ts'],
  clean: true,
  minify: 'terser',
  terserOptions: {
	  toplevel: false
  },
  tsconfig: 'config/tsconfig.min.json',
  outDir: 'build',
  platform: 'browser',
  target: 'esnext',
  format: 'iife',
});
