export const PEOPLE_AND_CODE = {
  type: 'people-and-code',
  name: 'People & Code Website',
  description:
    'People & Code website template. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
  vscodeSettings: true, // Indicates this project type needs custom VS Code settings
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
      static: 'cp src/robots.txt dist/robots.txt',
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
