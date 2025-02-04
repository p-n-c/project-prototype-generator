export const NUXT_TYPESCRIPT = {
  type: 'nuxt-typescript',
  name: 'Nuxt.js Web App',
  description:
    'Basic Nuxt.js app. Comes with Prettier formatting and ESlint. Optional support for Cypress e2e tests and Vite unit tests.',
  private: true,
  dependencies: {
    base: {
      nuxt: '^3.15.4',
      vue: 'latest',
      'vue-router': 'latest',
      '@nuxt/test-utils': '^3.15.4',
      '@vue/test-utils': '^2.4.6',
      'happy-dom': '^16.8.1',
      'playwright-core': '^1.50.1',
      vitest: '^3.0.4',
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      'stylelint-config-standard': 'latest',
      '@eslint/js': 'latest',
      'typescript-eslint': 'latest',
      '@nuxt/eslint': 'latest',
      '@vitejs/plugin-vue': 'latest',
    },
    test: {
      unit: {
        vitest: 'latest',
      },
      e2e: {
        cypress: 'latest',
      },
    },
  },
  scripts: {
    base: {
      build: 'nuxt build',
      dev: 'nuxt dev',
      generate: 'nuxt generate',
      preview: 'nuxt preview',
      postinstall: 'nuxt prepare',
      lint: 'eslint . && prettier --write . --log-level silent',
    },
    test: {
      test: 'vitest',
      'test:e2e': 'cypress open',
      'test:e2e:headless': 'cypress run',
    },
  },
  srcFolder: '',
  source: '',
  moduleType: 'module',
}
