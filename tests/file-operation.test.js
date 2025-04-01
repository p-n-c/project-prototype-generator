import { vi } from 'vitest'
import fs from 'fs-extra'
import { exec } from 'child_process'
import path from 'path'
import { FileOperations } from '../lib/file-operations.js'
import { getProjectConfigByType } from '../lib/project-definitions-api.js'

// Mock external dependencies fs-extra and child_process
vi.mock('fs-extra')
vi.mock('child_process', () => {
  // Retain access to the real implementations of other functions e.g. spawn
  const actualChildProcess = vi.importActual('child_process')
  return {
    ...actualChildProcess,
    // Mock the exec method explicitly. Implementation provided by
    // mockImplementation (custom implementation), or
    // mockReturnValue or mockResolvedValue (return a fixed value)
    exec: vi.fn(),
  }
})

const basicConfig = {
  type: 'basic',
  name: 'Web Basic',
  description:
    'HTML and CSS only website. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
  templates: {
    html: 'index.html',
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
}

vi.mock('../lib/project-definitions-api.js')
getProjectConfigByType.mockResolvedValue(basicConfig)

describe('FileOperations', () => {
  let fileOps
  const projectRoot = '/test/project'
  const templateRoot = '/test/templates'

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()

    // Create new FileOperations instance
    fileOps = new FileOperations(
      projectRoot,
      templateRoot,
      getProjectConfigByType
    )

    // Setup basic mock implementations
    fs.ensureDir.mockResolvedValue(undefined)
    fs.copy.mockResolvedValue(undefined)
    fs.readFile.mockResolvedValue(
      JSON.stringify({
        thread: {
          promptTemplate: {
            project: {
              title: '',
              description: '',
              definition: 'Project details go here…',
            },
            prototype: {
              type: '',
              typeDefinition: '',
            },
          },
        },
      })
    )
    fs.outputFile.mockResolvedValue(undefined)
    // Implement the signature of the callback from exec function:
    // exec(command, options, callback)
    exec.mockImplementation((command, options, callback) => {
      callback(null, { stdout: 'success' }, null)
    })
  })

  describe('createProjectStructure', () => {
    const options = {
      projectPath: projectRoot,
      srcFolder: 'src',
      includeE2ETests: false,
      projectTitle: 'Test Project',
      projectDescription: 'A test project',
      prototype: 'Conceptual',
      prototypes: [
        {
          name: 'Conceptual',
          value: 'Conceptual',
          description: 'Explores and validates initial ideas and approaches',
          humanPrompts: [
            'Who am I doing this for? Myself, my team, the company, clients?',
            'Do I have a clear objective?',
            'Are there limiting factors? These might include scope, time or resources.',
            'Does it depend on research? If so, have I supplied it.',
            'Is the concept limited to one domain or field such as business, interoperability or use experience?',
            'What problem am I trying to solve?',
            'Are there existing solutions I can learn from?',
            'What would success look like for this project?',
            'What assumptions am I making that should be validated?',
          ],
        },
      ],
    }

    it('should create basic project structure', async () => {
      await fileOps.createProjectStructure(basicConfig, options)

      // Verify directory creation
      expect(fs.ensureDir).toHaveBeenCalledWith(projectRoot)
      expect(fs.ensureDir).toHaveBeenCalledWith(path.join(projectRoot, 'src'))

      // Verify git initialisation
      expect(exec).toHaveBeenCalledWith(
        'git init',
        { cwd: projectRoot },
        expect.any(Function) // Match any callback function
      )
    })
  })

  describe('copyProjectTemplates', () => {
    it('should copy project-specific templates', async () => {
      const options = {
        srcFolder: 'src',
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
        prototype: 'Conceptual',
      }

      await fileOps.copyProjectTemplates(basicConfig, projectRoot, options)
    })

    it('should process template variables correctly', () => {
      const template =
        'Title: {{projectTitle}}, Description: {{projectDescription}}'
      const variables = {
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
        prototype: 'Conceptual',
      }

      const result = fileOps.processTemplateVariables(template, variables)
      expect(result).toBe('Title: Test Project, Description: A test project')
    })
  })

  describe('error handling', () => {
    it('should handle file system errors appropriately', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      fs.ensureDir.mockRejectedValue(new Error('Directory creation failed'))

      await expect(
        fileOps.createProjectStructure(basicConfig, {
          projectPath: projectRoot,
          srcFolder: 'src',
          includeE2ETests: false,
        })
      ).rejects.toThrow('Directory creation failed')
      consoleSpy.mockRestore() // Restore original behavior
    })

    it('should handle git initialisation errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      exec.mockImplementation((command, options, callback) => {
        callback(new Error('Git init failed'), null, null)
      })

      await expect(fileOps.initGit(projectRoot)).rejects.toThrow(
        'Git init failed'
      )
      consoleSpy.mockRestore() // Restore original behavior
    })
  })
})
