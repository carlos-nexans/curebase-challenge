import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      exclude: [
        '.next/**',
        '**/next.config.*',
        '**/next-env.d.ts',
        '**/*.config.*',
        'node_modules/**',
        'dist/**',
      ]
    }
  },
})

