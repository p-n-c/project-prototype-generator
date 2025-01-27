import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.test.js'],
    exclude: ['lib/projects/**/*.test.js', '**/node_modules/**'],
    globals: true,
  },
})
