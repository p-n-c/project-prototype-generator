import { loadProjectDefinitions } from './project-definitions.js'

const PROJECT_DEFINITIONS = await loadProjectDefinitions()

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

export function getPrototypeTypes() {
  return [
    {
      name: 'Conceptual',
      value: 'Conceptual',
      description: 'Explores and validates initial ideas and approaches',
    },
    {
      name: 'Horizontal',
      value: 'Horizontal',
      description:
        'Implements a broad slice of functionality across multiple features, typically focusing on user interface and experience',
    },
    {
      name: 'Vertical',
      value: 'Vertical',
      description:
        'Implements a narrow slice of complete functionality from user interface through to data storage',
    },
    {
      name: 'Functional',
      value: 'Functional',
      description:
        'Validates specific functional requirements or technical approaches',
    },
    {
      name: 'Visual',
      value: 'Visual',
      description:
        'A non-functional prototype focused on the design, layout, and user interface to gather feedback on aesthetics and usability',
    },
  ]
}
