#!/usr/bin/env node
/* eslint-disable no-undef */
import { promptQuestions } from './prompt-questions.js'
import path from 'path'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'

import {
  getProjectConfigByType,
  getProjectDependencies,
  getProjectScripts,
  getPrototypeTypes,
} from './project-definitions-api.js'
import { FileOperations } from './file-operations.js'
import { TestSetup } from './test-setup.js'
import { __dirname } from './dirname.js'

const exec = promisify(execCallback)

export async function generateProject({
  projectType,
  projectName,
  projectTitle,
  projectDescription,
  projectAuthor,
  srcFolder,
  includeUnitTests,
  includeE2ETests,
  prototype,
}) {
  const projectPath = path.join(process.cwd(), projectName)
  try {
    // Initialise helper classes
    const fileOps = new FileOperations(
      projectPath,
      __dirname,
      getProjectConfigByType
    )
    const testSetup = new TestSetup(
      projectPath,
      __dirname,
      srcFolder,
      getProjectConfigByType
    )

    // Get project type configuration
    const projectConfig = getProjectConfigByType(projectType)
    if (!projectConfig) {
      throw new Error(`Invalid project type: ${projectType}`)
    }

    // Create project structure
    await fileOps.createProjectStructure(projectConfig, {
      projectPath,
      projectTitle,
      projectDescription,
      srcFolder,
      includeUnitTests,
      includeE2ETests,
      prototype,
      prototypes: getPrototypeTypes(),
    })

    // Get dependencies and scripts using helper functions
    const devDependencies = getProjectDependencies(projectConfig, {
      includeUnitTests,
      includeE2ETests,
    })

    const scripts = getProjectScripts(projectConfig, {
      includeUnitTests,
      includeE2ETests,
    })

    // Set up package.json
    const packageJson = {
      name: projectName,
      version: '0.0.1',
      description: projectDescription,
      author: projectAuthor,
      type: `${projectConfig.moduleType}`,
      scripts,

      devDependencies,
    }

    if (srcFolder.length > 0)
      packageJson.source = `./${srcFolder}/${projectConfig.source}`

    // Add test configurations if needed
    if (includeUnitTests || includeE2ETests) {
      await testSetup.setupProjectTests(projectConfig, {
        includeUnitTests,
        includeE2ETests,
      })

      // Add test dependencies and scripts
      if (includeUnitTests) {
        Object.assign(
          packageJson.devDependencies,
          projectConfig.dependencies.test.unit
        )
      }

      if (includeE2ETests) {
        Object.assign(
          packageJson.devDependencies,
          projectConfig.dependencies.test.e2e
        )
        Object.assign(packageJson.scripts, {
          'test:e2e': 'cypress open',
          'test:e2e:headless': 'cypress run',
        })
      }
    }

    // Write package.json
    await fileOps.writeJson(projectPath, packageJson, 'package.json')

    console.log('\n')
    console.log('Gathering project files...')
    console.log('Installing dependencies...')
    console.log('This can take a minute or two...')

    await exec('npm install', { cwd: projectPath })

    console.log(`\nProject "${projectName}" has been created successfully.`)
    console.log('To get started, run the following commands:')
    console.log(`\ncd ${projectName} && npm run lint\n`)
  } catch (error) {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  }
}

// Main execution
promptQuestions()
  .then(generateProject)
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  })
