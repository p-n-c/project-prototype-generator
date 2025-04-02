export const NEXT_TYPESCRIPT = {
  type: 'next-typescript',
  name: 'Next.js TypeScript Web App',
  description:
    'Next.js app. TypeScript. LaunchDarkly. Prettier formatting and ESlint. Optional support for Cypress e2e tests and vitest unit tests.',
  dependencies: {
    base: {
      '@testing-library/dom': 'latest',
      '@testing-library/react': 'latest',
      '@types/node': 'latest',
      '@types/react': 'latest',
      '@types/react-dom': 'latest',
      eslint: 'latest',
      'eslint-config-next': 'latest',
      jsdom: 'latest',
      prettier: 'latest',
      typescript: 'latest',
      'launchdarkly-react-client-sdk': 'latest',
      next: 'latest',
      react: 'latest',
      'react-dom': 'latest',
    },
    test: {
      unit: {
        vitest: 'latest',
        'vite-tsconfig-paths': 'latest',
        '@vitejs/plugin-react': 'latest',
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
      prettier: 'npx prettier . -w',
    },
    test: {
      test: 'vitest',
      'test:e2e': 'cypress open',
      'test:e2e:headless': 'cypress run',
    },
  },
  srcFolder: 'src',
  source: 'page.tsx',
  moduleType: 'module',
}
