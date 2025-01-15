import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  js.configs.recommended,
  ...compat.config({
    extends: ['next'],
    settings: {
      next: {
        rootDir: 'packages/my-app/',
      },
    },
  }),
  {
    ignores: ['templates/'],
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
]
