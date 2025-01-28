import fs from 'fs'
import path from 'path'
import { __dirname } from './dirname.js'
import { pathToFileURL } from 'url'

export async function loadProjectDefinitions() {
  const PROJECT_DEFINITIONS = {}

  const libDir = path.resolve(__dirname)
  const projectDir = path.join(libDir, 'projects')

  try {
    const projectFolders = fs
      .readdirSync(projectDir)
      .filter((file) => fs.statSync(path.join(projectDir, file)).isDirectory())

    for (const projectName of projectFolders) {
      const definitionPath = path.join(
        projectDir,
        projectName,
        'project-definition.js'
      )

      try {
        const definitionURL = pathToFileURL(definitionPath).href
        const projectDefinition = await import(definitionURL)
        const projectObjName = projectName.replaceAll('-', '_').toUpperCase()
        PROJECT_DEFINITIONS[projectObjName] = {
          ...projectDefinition[projectObjName],
        }
      } catch (importError) {
        console.warn(
          `Could not load project definition for ${projectName}: ${importError.message}`
        )
      }
    }
  } catch (error) {
    console.error('Error reading project definitions:', error)
  }

  return PROJECT_DEFINITIONS
}
