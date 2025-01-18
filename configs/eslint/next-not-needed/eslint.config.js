import globals from 'globals'
import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  js.configs.recommended,
  {
    ignores: ['templates/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.react,
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
    },
  },
]
