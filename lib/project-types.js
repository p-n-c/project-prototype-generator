// src/lib/project-types.js
export const PROJECT_TYPES = {
  BASIC: {
    id: 'web',
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
    id: 'web-next',
    type: 'next',
    name: 'Next.js Web App',
    description: 'React web application with Next.js',
    templates: {
      react: ['page.jsx', 'layout.jsx'],
      additionalFiles: [],
    },
    dependencies: {
      base: {
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
    id: 'web-article',
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
    id: 'web-people-and-code',
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

// Helper functions for working with project types
export function getProjectConfigById(id) {
  const projectType = Object.values(PROJECT_TYPES).find(
    (type) => type.id === id
  )
  return projectType
}

export function getProjectConfigByType(type) {
  const projectType = Object.values(PROJECT_TYPES).find(
    (project) => project.type === type
  )
  return projectType
}

export function getProjectDependencies(
  projectType,
  { includeUnitTests, includeE2ETests }
) {
  const dependencies = { ...projectType.dependencies.base }

  if (includeUnitTests) {
    Object.assign(dependencies, projectType.dependencies.test.unit)
  }

  if (includeE2ETests) {
    Object.assign(dependencies, projectType.dependencies.test.e2e)
  }
  console.log('dependencies: ', dependencies)
  return dependencies
}

export function getProjectScripts(
  projectType,
  { includeUnitTests, includeE2ETests }
) {
  const scripts = { ...projectType.scripts.base }

  if (includeUnitTests || includeE2ETests) {
    Object.assign(scripts, projectType.scripts.test)
  }

  return scripts
}

export function getRequiredFiles(projectType) {
  const files = []

  // Add template files
  Object.entries(projectType.templates).forEach(([type, typeFiles]) => {
    if (Array.isArray(typeFiles)) {
      files.push(...typeFiles)
    } else if (typeFiles && type !== 'additionalFiles') {
      files.push(typeFiles)
    }
  })

  // Add additional files
  if (projectType.templates.additionalFiles) {
    files.push(...projectType.templates.additionalFiles)
  }

  return files
}
