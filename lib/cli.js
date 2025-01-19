#!/usr/bin/env node
/* eslint-disable no-undef */
import fs from 'fs-extra'

import { input, select } from '@inquirer/prompts'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  PROJECT_TYPES,
  getProjectConfigByType,
  getRequiredFiles,
  getProjectDependencies,
  getProjectScripts,
} from './project-types.js'
import { FileOperations } from './file-operations.js'
import { TestSetup } from './test-helpers.js'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
const exec = promisify(execCallback)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function generateProject({
  projectType,
  projectName,
  projectTitle,
  projectDescription,
  projectAuthor,
  srcFolder,
  includeUnitTests,
  includeE2ETests,
}) {
  const projectPath = path.join(process.cwd(), projectName)
  try {
    // Initialize helper classes
    const fileOps = new FileOperations(projectPath, __dirname)
    const testSetup = new TestSetup(projectPath, __dirname, srcFolder)

    // Get project type configuration
    const projectConfig = getProjectConfigByType(projectType)
    if (!projectConfig) {
      throw new Error(`Invalid project type: ${projectType}`)
    }

    // Get required files before creating structure
    // const requiredFiles = getRequiredFiles(projectConfig)

    // Create project structure
    await fileOps.createProjectStructure(projectConfig, {
      projectPath,
      projectTitle,
      projectDescription,
      srcFolder,
      includeUnitTests,
      includeE2ETests,
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
      type: 'module',
      scripts,
      source:
        projectConfig.type === 'next'
          ? [`./${srcFolder}/index.jsx`]
          : [`./${srcFolder}/index.html`],
      devDependencies,
    }

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
        Object.assign(packageJson.scripts, {
          test: 'jest',
          'test:watch': 'jest --watch',
        })
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

    // Add Next.js specific configurations
    if (projectType === 'web-next') {
      packageJson.overrides = {
        eslint: 'latest',
        glob: 'latest',
      }
    }

    // Write package.json
    // await fileOps.writeJson(path.join(projectPath, 'package.json'), packageJson)
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson)
    )

    console.log('Installing dependencies...')
    // await fileOps.installDependencies(projectPath)
    const { stdout } = await exec('npm install', { cwd: projectPath })
    console.log('*** stdout ***', stdout)

    console.log(`\nProject "${projectName}" has been created successfully.`)
    console.log('To get started, run the following commands:')
    console.log(`\ncd ${projectName} && npm run lint\n`)
  } catch (error) {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  }
}

// Helper function to get project type choices for the prompt
function getProjectTypeChoices() {
  const choices = Object.values(PROJECT_TYPES).map((type) => ({
    name: type.name,
    value: type.type,
    description: type.description,
  }))
  return choices
}

// Setup questions for the CLI
async function promptQuestions() {
  const projectType = await select({
    message: 'What type of project would you like to create?',
    choices: getProjectTypeChoices(),
  })

  const projectName = await input({
    message: 'Project name:',
    validate: (input) => {
      if (!input.match(/^[a-z0-9-]+$/)) {
        return 'Project name can only contain lowercase letters, numbers, and hyphens'
      }
      return true
    },
  })

  const projectTitle = await input({
    message: 'Project title:',
    default: projectName,
  })

  const projectDescription = await input({
    message: 'Project description:',
  })

  const projectAuthor = await input({
    message: 'Project author:',
  })

  const srcFolder = await input({
    message: 'Source folder name:',
    default: 'src',
  })

  const includeUnitTests = await select({
    message: 'Include unit tests?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ],
  })

  const includeE2ETests = await select({
    message: 'Include E2E tests?',
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false },
    ],
  })

  return {
    projectType,
    projectName: projectName.replace(' ', '-'),
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
    includeUnitTests,
    includeE2ETests,
  }
}

// Main execution
promptQuestions()
  .then(generateProject)
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  })
