import fs from 'fs-extra'
import path from 'path'
import { webBasic, webArticle } from './project-helpers.js'

export const addProjectTypeProperties = async (
  __dirname,
  projectType,
  projectPath,
  options
) => {
  const { projectTitle, projectDescription, srcFolder } = options

  switch (projectType) {
    case 'web':
      {
        // Create a basic HTML page
        const htmlContent = webBasic(projectTitle, projectDescription)
        await fs.writeFile(
          path.join(projectPath, srcFolder, 'index.html'),
          htmlContent
        )
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

        // Copy style sheet
        await fs.copy(
          path.join(__dirname, 'article', 'style.css'),
          path.join(projectPath, srcFolder, 'style.css')
        )
      }
      break
  }
}
