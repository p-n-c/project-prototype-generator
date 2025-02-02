export const TYPESCRIPT_BASIC = {
  type: 'typescript-basic',
  name: 'TypeScript Basic',
  description: 'Basic web project with TypeScript and modern tooling',
  dependencies: {
    base: {
      typescript: 'latest',
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      parcel: 'latest',
      'stylelint-config-standard': 'latest',
      '@eslint/js': 'latest',
      'typescript-eslint': 'latest',
      globals: '^15.14.0',
    },
    test: {
      unit: {
        jest: 'latest',
        'jest-environment-jsdom': 'latest',
        'ts-jest': 'latest',
        '@types/jest': 'latest',
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
      lint: 'eslint . && prettier --write . --log-level silent',
      start: 'parcel src/index.html',
      build: 'parcel build src/index.html',
      typecheck: 'tsc --noEmit',
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
