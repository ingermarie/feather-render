import { Options, defineConfig } from 'tsup'

const baseConfigMin: Options = {
  clean: true,
  minify: 'terser',
  tsconfig: './tsconfig.min.json',
  platform: 'browser',
  target: 'esnext',
  format: 'iife'
};
const configMinMeasure: Options = {
  ...baseConfigMin,
  entry: {'clean': 'src/index.min.ts'}
};
const configMin: Options = {
  ...baseConfigMin,
  entry: {'min': 'src/index.min.ts'},
  sourcemap: true
};

const baseConfig: Options = {
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  tsconfig: './tsconfig.json',
  platform: 'node'
};
const configCjs: Options = {
  ...baseConfig,
  format: 'cjs',
  outDir: 'dist/cjs'
};
const configEsm: Options = {
  ...baseConfig,
  format: 'esm',
  outDir: 'dist/esm'
};

export default defineConfig([configMinMeasure, configMin, configCjs, configEsm]);
