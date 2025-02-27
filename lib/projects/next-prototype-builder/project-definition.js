export const NEXT_PROTOTYPE_BUILDER = {
  type: 'next-prototype-builder',
  name: 'Next.js Prototype Builder',
  description: 'Prototype building app',
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
  questions: [
    {
      name: 'prototypeType',
      type: 'select',
      message: 'What type of project would you like to create?',
      choices: [
        {
          name: 'Concept',
          value: 'Concept',
          description: 'Explores and validates initial ideas and approaches',
        },
        {
          name: 'Throwaway',
          value: 'Throwaway',
          description:
            'A quick, disposable prototype used to explore ideas or validate concepts before starting the actual development',
        },
        {
          name: 'Evolutionary',
          value: 'Evolutionary',
          description:
            'A prototype that evolves over time, gradually becoming the final product through iterative development',
        },
        {
          name: 'Horizontal',
          value: 'Horizontal',
          description:
            'Implements a broad slice of functionality across multiple features, typically focusing on user interface and experience',
        },
        {
          name: 'Vertical',
          value: 'Vertical',
          description:
            'Implements a narrow slice of complete functionality from user interface through to data storage',
        },
        {
          name: 'Functional',
          value: 'Functional',
          description:
            'Validates specific functional requirements or technical approaches',
        },
        {
          name: 'Visual',
          value: 'Visual',
          description:
            'A non-functional prototype focused on the design, layout, and user interface to gather feedback on aesthetics and usability',
        },
        {
          name: 'Partial',
          value: 'Partial',
          description:
            'A prototype that focuses on a specific part of the system, such as a single feature or module, without necessarily implementing it in full depth or covering all layers',
        },
        {
          name: 'Wizard of Oz',
          value: 'Wizard of Oz',
          description:
            'A prototype where the system appears functional to the user, but the responses are manually controlled by a human behind the scenes, often used to simulate complex or AI-driven interactions',
        },
      ],
    },
  ],
}
