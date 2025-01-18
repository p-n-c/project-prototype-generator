import globals from 'globals'
import js from '@eslint/js'
import pluginCypress from 'eslint-plugin-cypress/flat'

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
        ...globals.jest,
      },
    },
  },
  pluginCypress.configs.recommended,
  pluginCypress.configs.globals,
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
