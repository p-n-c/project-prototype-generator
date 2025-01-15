import fs from 'fs-extra'
import path from 'path'
import {
  webBasic,
  webArticle,
  peopleAndCode,
  nextPage,
} from './project-helpers.js'

import { setupTests } from './test-setup.js'

export const addProjectTypeProperties = async (
  __dirname,
  projectType,
  projectPath,
  options
) => {
  const {
    projectTitle,
    projectDescription,
    srcFolder,
    includeUnitTests,
    includeE2ETests,
  } = options

  switch (projectType) {
    case 'web':
      {
        // Create a basic HTML page
        const htmlContent = webBasic(projectTitle, projectDescription)
        await fs.writeFile(
          path.join(projectPath, srcFolder, 'index.html'),
          htmlContent
        )

        // Copy .gitignore file
        await fs.copy(
          path.join(__dirname, 'web', '.gitignore'),
          path.join(projectPath, '.gitignore')
        )

        // // ES lint configuration
        // await fs.copy(
        //   path.join(__dirname, 'eslint.config.js'),
        //   path.join(projectPath, 'eslint.config.js')
        // )
      }
      break
    case 'web-next':
      {
        // Create a react page
        const page = nextPage(projectTitle, projectDescription)
        await fs.writeFile(path.join(projectPath, 'app', 'page.js'), page)

        // Copy .gitignore file
        await fs.copy(
          path.join(__dirname, 'next', '.gitignore'),
          path.join(projectPath, '.gitignore')
        )

        // // ES lint configuration
        // await fs.copy(
        //   path.join(__dirname, 'next', 'eslint.config.js'),
        //   path.join(projectPath, 'eslint.config.js')
        // )
      }
      break
    case 'web-article':
      {
        // Create an HTML article type page
        const htmlContent = webArticle(projectTitle, projectDescription)
        await fs.writeFile(
          path.join(projectPath, srcFolder, 'index.html'),
          htmlContent
        )

        // Copy .gitignore file
        await fs.copy(
          path.join(__dirname, 'article', '.gitignore'),
          path.join(projectPath, '.gitignore')
        )

        // Copy style sheet
        await fs.copy(
          path.join(__dirname, 'article', 'style.css'),
          path.join(projectPath, srcFolder, 'style.css')
        )

        // // ES lint configuration
        // await fs.copy(
        //   path.join(__dirname, 'eslint.config.js'),
        //   path.join(projectPath, 'eslint.config.js')
        // )
      }
      break
    case 'web-people-and-code':
      {
        // Create an HTML article type page
        const htmlContent = peopleAndCode(projectTitle, projectDescription)
        await fs.writeFile(
          path.join(projectPath, srcFolder, 'index.html'),
          htmlContent
        )

        // Copy .gitignore file
        await fs.copy(
          path.join(__dirname, 'people-and-code', '.gitignore'),
          path.join(projectPath, '.gitignore')
        )

        // Copy .prettierignore file
        await fs.copy(
          path.join(__dirname, 'people-and-code', '.prettierignore'),
          path.join(projectPath, '.prettierignore')
        )

        // Copy .vscode files
        await fs.copy(
          path.join(__dirname, 'people-and-code', '.vscode', 'settings.json'),
          path.join(projectPath, '.vscode', 'settings.json')
        )

        // Copy style sheet
        await fs.copy(
          path.join(__dirname, 'people-and-code', 'style.css'),
          path.join(projectPath, srcFolder, 'style.css')
        )

        // Copy sitemap
        await fs.copy(
          path.join(__dirname, 'people-and-code', 'sitemap.html'),
          path.join(projectPath, srcFolder, 'sitemap.html')
        )

        // Copy robots.txt
        await fs.copy(
          path.join(__dirname, 'people-and-code', 'robots.txt'),
          path.join(projectPath, srcFolder, 'robots.txt')
        )

        // // ES lint configuration
        // await fs.copy(
        //   path.join(__dirname, 'eslint.config.js'),
        //   path.join(projectPath, 'eslint.config.js')
        // )
      }
      break
  }

  await setupTests(projectPath, projectType, __dirname, {
    includeUnitTests,
    includeE2ETests,
  })
}
