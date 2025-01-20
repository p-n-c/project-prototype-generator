export const PROJECT_TYPES = {
  BASIC: {
    type: 'basic',
    name: 'Web Basic',
    description: 'Basic web project with modern tooling',
    templates: {
      html: 'index.html',
      additionalFiles: [],
    },
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
        lint: "eslint . && prettier --check . && stylelint '**/*.{css,scss}'",
        start: 'parcel && npm run static',
      },
      test: {
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:e2e': 'cypress open',
        'test:e2e:headless': 'cypress run',
      },
    },
  },

  NEXT: {
    type: 'next',
    name: 'Next.js Web App',
    description: 'React web application with Next.js',
    templates: {
      react: ['index.jsx', 'layout.jsx'],
      additionalFiles: [],
    },
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
        lint: 'next lint && prettier --check .',
      },
      test: {
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:e2e': 'cypress open',
        'test:e2e:headless': 'cypress run',
      },
    },
  },

  ARTICLE: {
    type: 'article',
    name: 'Web Article',
    description: 'Article-focused web project with three-column layout',
    templates: {
      html: 'index.html',
      css: ['style.css'],
      additionalFiles: [],
    },
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
        lint: "eslint . && prettier --check . && stylelint '**/*.{css,scss}'",
        start: 'parcel && npm run static',
      },
      test: {
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:e2e': 'cypress open',
        'test:e2e:headless': 'cypress run',
      },
    },
  },

  PEOPLE_AND_CODE: {
    type: 'people_and_code',
    name: 'People & Code Website',
    description: 'People & Code website template with accessibility features',
    templates: {
      html: 'index.html',
      css: ['style.css'],
      additionalFiles: ['robots.txt', 'sitemap.html'],
    },
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
        lint: "eslint . && prettier --check . && stylelint '**/*.{css,scss}'",
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
  },
}
