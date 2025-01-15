#!/usr/bin/env node
/* eslint-disable no-undef */

import { input, select } from '@inquirer/prompts'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import { addProjectTypeProperties } from './project-type-properties.js'
import { promptQuestions } from './prompt-questions.js'

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
    if (await fs.pathExists(projectPath)) {
      console.error(`Project directory "${projectName}" already exists.`)
      process.exit(1)
    }

    // Create the project directory
    await fs.mkdir(projectPath)

    // Initialise git repository
    console.log('\nInitialising git repository...')
    await exec('git init', { cwd: projectPath })

    let devDependencies = {
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      parcel: 'latest',
      'stylelint-config-standard': 'latest',
      globals: '^15.14.0',
    }

    // Add test dependencies based on project type and test choices
    if (includeUnitTests) {
      devDependencies = {
        ...devDependencies,
        jest: 'latest',
        'jest-environment-jsdom': 'latest',
        '@babel/preset-env': 'latest',
      }

      // Add React-specific testing libraries for Next.js
      if (projectType === 'web-next') {
        devDependencies = {
          ...devDependencies,
          '@testing-library/react': 'latest',
          '@testing-library/jest-dom': 'latest',
          '@testing-library/user-event': 'latest',
          '@babel/preset-react': 'latest',
        }
      } else {
        // Add DOM testing libraries for other project types
        devDependencies = {
          ...devDependencies,
          '@testing-library/dom': 'latest',
          '@testing-library/user-event': 'latest',
        }
      }
    }

    if (includeE2ETests) {
      devDependencies = {
        ...devDependencies,
        cypress: 'latest',
      }
    }

    switch (projectType) {
      case 'web-next':
        devDependencies = {
          ...devDependencies,
          next: 'latest',
          react: 'latest',
          'react-dom': 'latest',
          '@next/eslint-plugin-next': 'latest',
          // 'eslint-config-next': 'latest',
        }
        break
    }

    // Initialise npm package
    let packageJson = {
      name: projectName,
      version: '0.0.1',
      description: projectDescription,
      author: projectAuthor,
      type: 'module',
      scripts: {
        lint: "eslint . && prettier --check . && stylelint '**/*.{css,scss}'",
        start: 'parcel && npm run static',
      },
      source: ['./src/index.html'],
      devDependencies,
    }

    if (includeUnitTests) {
      packageJson.scripts = {
        ...packageJson.scripts,
        tests: 'jest',
        'tests:watch': 'jest --watch',
      }
    }

    if (includeE2ETests) {
      packageJson.scripts = {
        ...packageJson.scripts,
        'test:e2e': 'cypress open',
        'test:e2e:headless': 'cypress run',
      }
    }

    switch (projectType) {
      case 'web-next':
        packageJson = {
          ...packageJson,
          scripts: {
            ...packageJson.scripts,
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
            lint: 'next lint',
          },
          source: ['./app/page.jsx'],
          overrides: {
            eslint: 'latest',
            glob: 'latest',
          },
        }
        break
      case 'web-people-and-code':
        packageJson.scripts = {
          ...packageJson.scripts,
          static: 'cp src/robots.txt dist/robots.txt',
        }
    }

    await fs.writeJson(path.join(projectPath, 'package.json'), packageJson, {
      spaces: 2,
    })

    switch (projectType) {
      case 'web-next':
        await fs.mkdir(path.join(projectPath, 'app'))
        break
      default:
        // Create src folder
        await fs.mkdir(path.join(projectPath, srcFolder))
    }

    // Copy configuration files
    await fs.copy(
      path.join(__dirname, 'prettier.config.js'),
      path.join(projectPath, 'prettier.config.js')
    )
    await fs.copy(
      path.join(__dirname, '.stylelintrc.json'),
      path.join(projectPath, '.stylelintrc.json')
    )

    // Copy .vscode files
    // await fs.copy(
    //   path.join(__dirname, 'people-and-code', '.vscode'),
    //   path.join(projectPath, '.vscode')
    // )

    // Create README.md
    await fs.writeFile(
      path.join(projectPath, 'README.md'),
      `# ${projectTitle}\n\n${projectDescription}\n`
    )

    // Add files that are specific to the type of project, e.g. web or (chrome) ext (extension)
    addProjectTypeProperties(__dirname, projectType, projectPath, {
      projectName,
      projectTitle,
      projectDescription,
      srcFolder,
      includeUnitTests,
      includeE2ETests,
    })

    console.log('Gathering project files...')

    // Install project dependencies and update the project owner
    console.log('Installing dependencies...')
    console.log('This can take a minute or two...')
    const { stdout } = await exec('npm install', { cwd: projectPath })
    console.log(stdout)
    console.log(
      `The project dependencies for "${projectName}" have been installed.`
    )

    // Display instructions to complete project setup
    console.log('To get started, run the following commands:')
    console.log(`\ncd ${projectName} && npm run lint\n`)
  } catch (error) {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  }
}

// Generate project based on responses to setup questions
promptQuestions(input, select)
  .then(generateProject)
  .catch((error) => {
    console.error(`An error occurred: ${error.message}`)
    process.exit(1)
  })
