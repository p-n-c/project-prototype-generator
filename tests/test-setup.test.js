import fs from 'fs-extra'
import path from 'path'
import { TestSetup } from '../lib/test-setup.js'
import { getProjectConfigByType } from '../lib/project-definitions-api.js'
import { FileOperations } from '../lib/file-operations.js'

// Mock fs-extra
jest.mock('fs-extra')

describe('TestSetup', () => {
  let testSetup
  const projectPath = '/test/project'
  const templateRoot = '/test/generator/lib'
  const srcFolder = 'src'
  const basicConfig = getProjectConfigByType('basic')

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
    it('should copy all files found in the config directory', async () => {
      // Mock getFilesInDirectory to return multiple files
      const mockFiles = [
        'jest.config.json',
        'test-setup.json',
        'extra-config.json',
      ]
      jest
        .spyOn(FileOperations.prototype, 'getFilesInDirectory')
        .mockReturnValue(mockFiles)

      await testSetup.setupUnitTests(basicConfig)

      // Verify each file is copied
      mockFiles.forEach((file) => {
        expect(fs.copy).toHaveBeenCalledWith(
          expect.stringContaining(file),
          path.join(projectPath, file)
        )
      })
    })

    it('should handle empty config directory', async () => {
      // Mock getFilesInDirectory to return an empty array
      jest
        .spyOn(FileOperations.prototype, 'getFilesInDirectory')
        .mockReturnValue([])

      await testSetup.setupUnitTests(basicConfig)

      // Ensure no copy attempts are made
      expect(fs.copy).not.toHaveBeenCalled()
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
    it('should handle directory creation errors', async () => {
      fs.ensureDir.mockRejectedValue(new Error('Directory creation failed'))

      await expect(testSetup.copyTestTemplates(basicConfig)).rejects.toThrow(
        'Directory creation failed'
      )
    })
  })
})
