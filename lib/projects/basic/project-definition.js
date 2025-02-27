export const BASIC = {
  type: 'basic',
  name: 'Web Basic',
  description:
    'HTML and CSS only website. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
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
      lint: 'eslint . && prettier --write . --log-level silent',
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
  questions: [
    {
      name: 'prototypeType',
      type: 'select',
      message: 'What type of project prototype would you like to create?',
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
