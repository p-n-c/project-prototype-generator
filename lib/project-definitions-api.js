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
      name: 'Concept',
      value: 'Concept',
      description: 'Explores and validates initial ideas and approaches',
    },
    {
      name: 'Throwaway',
      value: 'Throwaway',
      description:
        'A quick, disposable prototype used to explore ideas or validate concepts before starting the actual development',
    },
    {
      name: 'Evolutionary',
      value: 'Evolutionary',
      description:
        'A prototype that evolves over time, gradually becoming the final product through iterative development',
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
    {
      name: 'Partial',
      value: 'Partial',
      description:
        'A prototype that focuses on a specific part of the system, such as a single feature or module, without necessarily implementing it in full depth or covering all layers',
    },
    {
      name: 'Wizard of Oz',
      value: 'Wizard of Oz',
      description:
        'A prototype where the system appears functional to the user, but the responses are manually controlled by a human behind the scenes, often used to simulate complex or AI-driven interactions',
    },
  ]
}
