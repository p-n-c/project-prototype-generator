export const ARTICLE = {
  type: 'article',
  name: 'Web Article',
  description:
    'HTML and CSS only website with three-column layout. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
  dependencies: {
    base: {
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      parcel: 'latest',
      'stylelint-config-standard': 'latest',
      globals: '^15.14.0',
    },
    test: {
      unit: {
        jest: 'latest',
        'jest-environment-jsdom': 'latest',
        '@babel/preset-env': 'latest',
        '@testing-library/dom': 'latest',
        '@testing-library/user-event': 'latest',
      },
      e2e: {
        cypress: 'latest',
      },
    },
  },
  scripts: {
    base: {
      lint: "eslint . && prettier --write . --log-level silent && stylelint '**/*.{css,scss}'",
      start: 'parcel && npm run static',
    },
    test: {
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:e2e': 'cypress open',
      'test:e2e:headless': 'cypress run',
    },
  },
  srcFolder: 'src',
  source: 'index.html',
  moduleType: 'module',
}
