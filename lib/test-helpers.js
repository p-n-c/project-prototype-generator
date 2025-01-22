import fs from 'fs-extra'
import path from 'path'

export class TestSetup {
  constructor(projectPath, templateRoot, srcFolder) {
    this.projectPath = projectPath
    this.templateRoot = templateRoot
    this.srcFolder = srcFolder

    const root = this.templateRoot.slice(0, this.templateRoot.length - 4) // generator root

    this.testTemplatesPath = path.join(templateRoot, 'templates', 'tests')
    this.configsPath = path.join(root, 'configs')
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
    const testConfigSrc = path.join(
      this.configsPath,
      'jest',
      projectConfig.type,
      'jest.config.json'
    )
    await fs.copy(
      testConfigSrc,
      path.join(this.projectPath, 'jest.config.json')
    )

    // Copy test templates
    await this.copyTestTemplates(projectConfig)

    // Setup additional test configurations if needed
    if (projectConfig.type === 'next') {
      await this.setupNextJsTestConfig()
    } else {
      // covered in config section…
      // await this.setupBasicTestConfig()
    }
  }

  async copyTestTemplates(projectConfig) {
    const testTemplatesDir = path.join(
      this.testTemplatesPath,
      'unit',
      projectConfig.type
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

  async setupNextJsTestConfig() {
    // Copy Next.js specific test setup files
    await fs.copy(
      path.join(this.configsPath, 'jest/next/jest.setup.js'),
      path.join(this.projectPath, 'jest.setup.js')
    )

    await fs.copy(
      path.join(this.configsPath, 'jest/next/.babelrc'),
      path.join(this.projectPath, '.babelrc')
    )
  }

  async setupBasicTestConfig() {
    // Copy basic ESLint configuration for tests
    await fs.copy(
      path.join(this.configsPath, 'config/basic/eslint.config.js'),
      path.join(this.projectPath, 'eslint.config.js')
    )
  }
}
