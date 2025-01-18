import fs from 'fs-extra'
import path from 'path'

import { PROJECT_TYPES } from './project-types.js'

export class TestSetup {
  constructor(projectPath, templateRoot) {
    this.projectPath = projectPath
    this.templateRoot = templateRoot
  }

  async setupProjectTests(projectType, options) {
    const { includeUnitTests, includeE2ETests } = options

    if (includeUnitTests) {
      await this.setupUnitTests(projectType)
    }

    if (includeE2ETests) {
      await this.setupE2ETests(projectType)
    }
  }

  async setupUnitTests(projectType) {
    const config = PROJECT_TYPES[projectType]
    const testConfig = path.join(
      this.templateRoot,
      'configs/jest',
      `${config.id}.json`
    )

    await fs.copy(testConfig, path.join(this.projectPath, 'jest.config.json'))
    await this.copyTestTemplates(projectType)
  }

  async setupE2ETests(projectType) {
    const cypressStructure = [
      'cypress/e2e',
      'cypress/fixtures',
      'cypress/support',
    ]

    for (const dir of cypressStructure) {
      await fs.ensureDir(path.join(this.projectPath, dir))
    }

    await this.copyE2ETemplates(projectType)
  }
}
