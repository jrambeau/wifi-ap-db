import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    testTimeout: 10000,
    hookTimeout: 10000,
    reporters: ['verbose'],
    logHeapUsage: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/docs/**', '**/.{idea,git,cache,output,temp}/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
