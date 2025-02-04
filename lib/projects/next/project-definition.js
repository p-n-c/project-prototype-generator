export const NEXT = {
  type: 'next',
  name: 'Next.js Web App',
  description:
    'Basic Next.js app. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
  dependencies: {
    base: {
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      parcel: 'latest',
      'stylelint-config-standard': 'latest',
      globals: '^15.14.0',
      next: 'latest',
      react: 'latest',
      'react-dom': 'latest',
      '@next/eslint-plugin-next': 'latest',
    },
    test: {
      unit: {
        jest: 'latest',
        'jest-environment-jsdom': 'latest',
        '@babel/preset-env': 'latest',
        '@babel/preset-react': 'latest',
        '@testing-library/react': 'latest',
        '@testing-library/jest-dom': 'latest',
        '@testing-library/user-event': 'latest',
      },
      e2e: {
        cypress: 'latest',
      },
    },
  },
  scripts: {
    base: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint && prettier --write . --log-level silent',
    },
    test: {
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:e2e': 'cypress open',
      'test:e2e:headless': 'cypress run',
    },
  },
  srcFolder: 'app',
  source: 'page.jsx',
  moduleType: 'module',
}
