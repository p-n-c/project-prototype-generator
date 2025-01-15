import fs from 'fs-extra'
import path from 'path'

// 3. Add new function to project-type-properties.js for test setup
export async function setupTests(
  projectPath,
  projectType,
  __dirname,
  { includeUnitTests, includeE2ETests }
) {
  if (includeUnitTests) {
    // Add Jest configuration
    const jestConfig = {
      testEnvironment: 'jsdom',
      setupFilesAfterEnv:
        projectType === 'web-next' ? ['<rootDir>/jest.setup.js'] : [],
      testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
          'babel-jest',
          { presets: ['@babel/preset-env'] },
        ],
      },
    }
    await fs.writeJson(path.join(projectPath, 'jest.config.json'), jestConfig, {
      spaces: 2,
    })

    // Add jest.setup.js for Next.js projects
    if (projectType === 'web-next') {
      const setupFileContent = `
        import '@testing-library/jest-dom'
        
        // Add any custom jest matchers here
        // Add any global test setup here
        `
      await fs.writeFile(
        path.join(projectPath, 'jest.setup.js'),
        setupFileContent.trim()
      )

      // Babel config for Next.js projects
      const babelConfig = {
        presets: ['@babel/preset-env', '@babel/preset-react'],
      }
      await fs.writeJson(path.join(projectPath, '.babelrc'), babelConfig, {
        spaces: 2,
      })
    }

    // Add example tests based on project type
    await addExampleTests(projectPath, projectType)

    // ES lint jest test configuration
    if (projectType === 'web-next') {
      // Next.js projects are config'd during setup
    } else {
      await fs.copy(
        path.join(__dirname, 'tests', 'eslint.config.js'),
        path.join(projectPath, 'eslint.config.js')
      )
    }
  } else if (includeE2ETests) {
    // Set up Cypress directory structure
    await fs.mkdir(path.join(projectPath, 'cypress'))
    await fs.mkdir(path.join(projectPath, 'cypress/e2e'))
    await fs.mkdir(path.join(projectPath, 'cypress/fixtures'))
    await fs.mkdir(path.join(projectPath, 'cypress/support'))

    // NB Cypress configuration is handled directly by Cypress during set up

    // Add example Cypress tests
    await addExampleCypressTests(projectPath, projectType)
  } else {
    // ES lint basic configuration
    if (projectType === 'web-next') {
      // Next.js projects are config'd during setup
    } else {
      await fs.copy(
        path.join(__dirname, 'no-tests', 'eslint.config.js'),
        path.join(projectPath, 'eslint.config.js')
      )
    }
  }
}

// 4. Helper function for adding example tests
async function addExampleTests(projectPath, projectType) {
  switch (projectType) {
    case 'web-next': {
      // Example Next.js component test
      const componentTest = `
        import React from 'react'
        import { render, screen } from '@testing-library/react'
        import Home from '../app/page'

        describe('Home', () => {
          it('renders the main heading', () => {
            render(<Home />)
            expect(screen.getByRole('heading', { level: 1 }))
          })
        })
        `
      await fs.writeFile(
        path.join(projectPath, 'app/page.test.js'),
        componentTest
      )
      break
    }

    default: {
      // Example DOM test for other project types
      const domTest = `
          import { getByText } from '@testing-library/dom'

          describe('Homepage', () => {
            it('displays the main heading', () => {
              document.body.innerHTML = '<h1>Welcome</h1>'
              expect(getByText(document.body, 'Welcome'))
            })
          })
          `
      await fs.writeFile(path.join(projectPath, 'src/index.test.js'), domTest)
    }
  }
}

// 5. Helper function for adding Cypress tests
async function addExampleCypressTests(projectPath, projectType) {
  const cypressTest = `
    describe('Homepage', () => {
      beforeEach(() => {
        cy.visit('/')
      })

      it('displays the main heading', () => {
        cy.get('h1').should('be.visible')
      })

      ${
        projectType === 'web-article'
          ? `
          it('has a readable article layout', () => {
            cy.get('article').should('exist')
            cy.get('p').should('have.css', 'max-width').and('be.lessThan', '800')
          })
          `
          : ''
      }
    })
    `
  await fs.writeFile(
    path.join(projectPath, 'cypress/e2e/homepage.cy.js'),
    cypressTest
  )
}
