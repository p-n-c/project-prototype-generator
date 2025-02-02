import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [
      '.nuxt/**',
      // You might also want to ignore other build/generated directories
      'dist/**',
      '.output/**',
    ],
  }
)
