import { PROJECT_DEFINITIONS } from './project-definitions.js'

export const getAllProjectTypes = () => {
  return PROJECT_DEFINITIONS
}

export function getProjectConfigByType(type) {
  try {
    const projectType = Object.values(PROJECT_DEFINITIONS).find(
      (project) => project.type === type
    )
    return projectType
  } catch (e) {
    console.error('Error getting project config by type:', e)
    throw e
  }
}

export function getProjectDependencies(
  projectType,
  { includeUnitTests, includeE2ETests }
) {
  const dependencies = { ...projectType.dependencies.base }

  if (includeUnitTests) {
    Object.assign(dependencies, projectType.dependencies.test.unit)
  }

  if (includeE2ETests) {
    Object.assign(dependencies, projectType.dependencies.test.e2e)
  }

  return dependencies
}

export function getProjectScripts(
  projectType,
  { includeUnitTests, includeE2ETests }
) {
  const scripts = { ...projectType.scripts.base }

  if (includeUnitTests || includeE2ETests) {
    Object.assign(scripts, projectType.scripts.test)
  }

  return scripts
}
