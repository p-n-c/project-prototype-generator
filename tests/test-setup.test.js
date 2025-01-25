import fs from 'fs-extra'
import path from 'path'
import { TestSetup } from '../lib/test-setup.js'
import { getProjectConfigByType } from '../lib/project-types-api.js'

// Mock fs-extra
jest.mock('fs-extra')

describe('TestSetup', () => {
  let testSetup
  const projectPath = '/test/project'
  const templateRoot = '/test/generator/lib'
  const srcFolder = 'src'
  const basicConfig = getProjectConfigByType('basic')
  const nextConfig = getProjectConfigByType('next')

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // Create new TestSetup instance
    testSetup = new TestSetup(projectPath, templateRoot, srcFolder)

    // Setup basic mock implementations
    fs.ensureDir.mockResolvedValue(undefined)
    fs.copy.mockResolvedValue(undefined)
    fs.readdir.mockResolvedValue(['index.test.js', 'component.test.js'])
  })

  describe('constructor', () => {
    it('should initialize with correct paths', () => {
      expect(testSetup.projectPath).toBe(projectPath)
      expect(testSetup.templateRoot).toBe(templateRoot)
      expect(testSetup.srcFolder).toBe(srcFolder)
      expect(testSetup.testTemplatesPath).toBe(
        path.join(templateRoot, 'templates')
      )
      // generator root should be '/test/generator'
      expect(testSetup.configsPath).toBe(
        path.join('/test/generator', 'configs')
      )
    })
  })

  describe('setupProjectTests', () => {
    it('should setup unit tests when includeUnitTests is true', async () => {
      const setupUnitTestsSpy = jest.spyOn(testSetup, 'setupUnitTests')

      await testSetup.setupProjectTests(basicConfig, {
        includeUnitTests: true,
        includeE2ETests: false,
      })

      expect(setupUnitTestsSpy).toHaveBeenCalledWith(basicConfig)
    })

    it('should not setup any tests when both options are false', async () => {
      const setupUnitTestsSpy = jest.spyOn(testSetup, 'setupUnitTests')

      await testSetup.setupProjectTests(basicConfig, {
        includeUnitTests: false,
        includeE2ETests: false,
      })

      expect(setupUnitTestsSpy).not.toHaveBeenCalled()
    })
  })

  describe('setupUnitTests', () => {
    it('should copy jest config and test templates for basic project', async () => {
      await testSetup.setupUnitTests(basicConfig)

      // Verify jest config copying
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining(
          path.join('configs', 'jest', 'basic', 'jest.config.json')
        ),
        path.join(projectPath, 'jest.config.json')
      )

      // Verify test templates copying
      expect(fs.readdir).toHaveBeenCalled()
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining(
          path.join('basic', 'tests', 'unit', 'index.test.js')
        ),
        expect.any(String)
      )
    })

    it('should setup additional configs for Next.js project', async () => {
      await testSetup.setupUnitTests(nextConfig)

      // Verify Next.js specific config copying
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining(path.join('jest', 'next', 'jest.setup.js')),
        path.join(projectPath, 'jest.setup.js')
      )
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining(path.join('jest', 'next', '.babelrc')),
        path.join(projectPath, '.babelrc')
      )
    })
  })

  describe('copyTestTemplates', () => {
    it('should copy all test templates to the target directory', async () => {
      await testSetup.copyTestTemplates(basicConfig)

      // Verify directory creation
      expect(fs.ensureDir).toHaveBeenCalledWith(
        path.join(projectPath, srcFolder)
      )

      // Verify template copying for each mock file
      expect(fs.copy).toHaveBeenCalledTimes(2) // Because our mock returns 2 files
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('index.test.js'),
        path.join(projectPath, srcFolder, 'index.test.js')
      )
      expect(fs.copy).toHaveBeenCalledWith(
        expect.stringContaining('component.test.js'),
        path.join(projectPath, srcFolder, 'component.test.js')
      )
    })

    it('should handle errors when reading template directory', async () => {
      fs.readdir.mockRejectedValue(new Error('Failed to read directory'))

      await expect(testSetup.copyTestTemplates(basicConfig)).rejects.toThrow(
        'Failed to read directory'
      )
    })
  })

  describe('error handling', () => {
    it('should handle file copy errors', async () => {
      fs.copy.mockRejectedValue(new Error('Copy failed'))

      await expect(testSetup.setupUnitTests(basicConfig)).rejects.toThrow(
        'Copy failed'
      )
    })

    it('should handle directory creation errors', async () => {
      fs.ensureDir.mockRejectedValue(new Error('Directory creation failed'))

      await expect(testSetup.copyTestTemplates(basicConfig)).rejects.toThrow(
        'Directory creation failed'
      )
    })
  })
})
