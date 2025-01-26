import fs from 'fs-extra'
import path from 'path'

import { FileOperations } from './file-operations.js'

export class TestSetup {
  constructor(projectPath, templateRoot, srcFolder) {
    this.projectPath = projectPath
    this.templateRoot = templateRoot
    this.srcFolder = srcFolder
  }

  async setupProjectTests(projectConfig, options) {
    const { includeUnitTests, includeE2ETests } = options

    if (includeUnitTests) {
      await this.setupUnitTests(projectConfig)
    }

    if (includeE2ETests) {
      // Instead of providing an example, we rely on the Cypress set up to generate an example test/spec
    }
  }

  async setupUnitTests(projectConfig) {
    const directoryPath = path.join(
      this.templateRoot, // lib
      projectConfig.type, // e.g. basic, article
      'templates',
      'tests/unit/config'
    )

    const fileOps = new FileOperations(this.projectPath, this.templateRoot)

    const filesInDirectory = fileOps.getFilesInDirectory(directoryPath)

    filesInDirectory.forEach(async (file) => {
      await fs.copy(
        path.join(directoryPath, file),
        path.join(this.projectPath, file)
      )
    })

    // Copy test templates
    await this.copyTestTemplates(projectConfig)
  }

  async copyTestTemplates(projectConfig) {
    const testTemplatesDir = path.join(
      this.templateRoot,
      projectConfig.type, // e.g. basic, next
      'templates',
      'tests',
      'unit'
    )

    // Define the target directory based on project type
    const targetDir = path.join(this.projectPath, this.srcFolder)

    // Ensure target directory exists
    await fs.ensureDir(targetDir)

    // Copy all test files from the template directory
    const testFiles = await fs.readdir(testTemplatesDir)
    for (const file of testFiles) {
      await fs.copy(
        path.join(testTemplatesDir, file),
        path.join(targetDir, file)
      )
    }
  }

  // async setupNextJsTestConfig(projectConfig) {
  //   // Copy Next.js specific test setup files
  //   await fs.copy(
  //     path.join(
  //       this.templateRoot,
  //       projectConfig.type,
  //       'templates',
  //       'tests/unit/config',
  //       'jest.setup.js'
  //     ),
  //     path.join(this.projectPath, 'jest.setup.js')
  //   )

  //   await fs.copy(
  //     path.join(this.configsPath, 'jest/next/.babelrc'),
  //     path.join(this.projectPath, '.babelrc')
  //   )
  // }
}
