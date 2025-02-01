import globals from 'globals'
import js from '@eslint/js'
import vitest from '@vitest/eslint-plugin'

export default [
  js.configs.recommended,
  {
    ignores: ['templates/'],
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      vitest,
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
