export const projectConfigSchema = {
  type: {
    type: 'string',
    required: true,
    pattern: /^[a-z-]+$/, // lowercase with underscores
    description: 'Unique identifier for the project type',
  },
  name: {
    type: 'string',
    required: true,
    description: 'User-friendly display name',
  },
  description: {
    type: 'string',
    required: true,
    description: 'Project type description shown in selection',
  },
  templates: {
    type: 'object',
    properties: {
      html: {
        type: ['string', 'array'],
        description: 'HTML template file(s)',
      },
      css: {
        type: ['string', 'array'],
        description: 'CSS template file(s)',
      },
      react: {
        type: ['string', 'array'],
        description: 'React component file(s)',
      },
      other: {
        type: 'array',
        description: 'Additional template files',
      },
    },
  },
  dependencies: {
    type: 'object',
    required: true,
    properties: {
      base: {
        type: 'object',
        required: true,
        description: 'Core project dependencies',
        dynamicProperties: {
          type: 'string',
          pattern: /^(latest|\^?\d+\.\d+\.\d+)$/,
        },
      },
      test: {
        type: 'object',
        required: true,
        properties: {
          unit: {
            type: 'object',
            required: true,
            description: 'Unit testing dependencies',
            dynamicProperties: {
              type: 'string',
              pattern: /^(latest|\^?\d+\.\d+\.\d+)$/,
            },
          },
          e2e: {
            type: 'object',
            required: true,
            description: 'E2E testing dependencies',
            dynamicProperties: {
              type: 'string',
              pattern: /^(latest|\^?\d+\.\d+\.\d+)$/,
            },
          },
        },
      },
    },
  },
  scripts: {
    type: 'object',
    required: true,
    properties: {
      base: {
        type: 'object',
        required: true,
        description: 'Core project scripts',
        properties: {
          lint: {
            type: 'string',
            required: true,
          },
          start: {
            type: 'string',
            required: true,
          },
        },
      },
      test: {
        type: 'object',
        required: true,
        properties: {
          test: {
            type: 'string',
            required: true,
          },
          'test:watch': {
            type: 'string',
            required: true,
          },
          'test:e2e': {
            type: 'string',
            required: true,
          },
          'test:e2e:headless': {
            type: 'string',
            required: true,
          },
        },
      },
    },
  },
  vscodeSettings: {
    type: 'boolean',
    required: false,
    description: 'Whether project needs custom VS Code settings',
  },
}
