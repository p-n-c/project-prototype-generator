import fs from 'fs-extra'
import { exec } from 'child_process'
import path from 'path'
import { FileOperations } from '../lib/file-operations.js'
import { getProjectConfigByType } from '../lib/project-types-api.js'

// Mock external dependencies fs-extra and child_process
jest.mock('fs-extra')
jest.mock('child_process', () => {
  // Retain access to the real implementations of other functions e.g. spawn
  const actualChildProcess = jest.requireActual('child_process')
  return {
    ...actualChildProcess,
    // Mock the exec method explicitly. Implementation provided by
    // mockImplementation (custom implementation), or
    // mockReturnValue or mockResolvedValue (return a fixed value)
    exec: jest.fn(),
  }
})

describe('FileOperations', () => {
  let fileOps
  const projectRoot = '/test/project'
  const templateRoot = '/test/templates'
  const basicConfig = getProjectConfigByType('basic')

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Create new FileOperations instance
    fileOps = new FileOperations(projectRoot, templateRoot)

    // Setup basic mock implementations
    fs.ensureDir.mockResolvedValue(undefined)
    fs.copy.mockResolvedValue(undefined)
    fs.readFile.mockResolvedValue('template content')
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

    it('should copy base configuration files', async () => {
      await fileOps.copyBaseConfigs(basicConfig, projectRoot, false)

      // Verify essential config files are copied
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('.gitignore'),
        path.join(projectRoot, '.gitignore')
      )
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('prettier.config.js'),
        path.join(projectRoot, 'prettier.config.js')
      )
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('.stylelintrc.json'),
        path.join(projectRoot, '.stylelintrc.json')
      )
    })
  })

  describe('copyProjectTemplates', () => {
    it('should copy project-specific templates', async () => {
      const options = {
        srcFolder: 'src',
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
      }

      await fileOps.copyProjectTemplates(basicConfig, projectRoot, options)

      // Verify template file reading and processing
      expect(fs.readFile).toHaveBeenCalled()
      expect(fs.outputFile).toHaveBeenCalled()
    })

    it('should process template variables correctly', () => {
      const template =
        'Title: {{projectTitle}}, Description: {{projectDescription}}'
      const variables = {
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
      }

      const result = fileOps.processTemplateVariables(template, variables)
      expect(result).toBe('Title: Test Project, Description: A test project')
    })
  })

  describe('error handling', () => {
    it('should handle file system errors appropriately', async () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
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
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})
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
