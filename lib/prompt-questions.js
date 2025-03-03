import { input, select } from '@inquirer/prompts'

import {
  getAllProjectTypes,
  getProjectConfigByType,
  getConceptTypes,
} from './project-definitions-api.js'
import { validateProjectName } from './utils.js'

function getProjectTypeChoices() {
  const choices = Object.values(getAllProjectTypes()).map((type) => ({
    name: type.name,
    value: type.type,
    description: type.description,
  }))
  return choices
}

export const promptQuestions = async () => {
  const projectType = await select({
    message: 'What type of project prototype would you like to create?',
    choices: getProjectTypeChoices(),
  })

  const projectName = await input({
    message: 'Project name:',
    validate: (input) => validateProjectName(input),
  })

  const projectTitle = await input({
    message: 'Project title:',
    default: projectName,
  })

  const projectDescription = await input({
    message: 'Project description:',
    default: `New ${getProjectTypeChoices().find((project) => project.value === projectType).name} project`,
  })

  const projectAuthor = await input({
    message: 'Project author:',
  })

  const projectConfig = getProjectConfigByType(projectType)

  const srcFolder = projectConfig?.srcFolder || 'src'

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

  const prototype = await select({
    message: 'Which prototype type best defines your project?',
    choices: getConceptTypes(),
  })

  return {
    projectType,
    projectName: projectName?.replace(' ', '-').toLowerCase(),
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
    includeUnitTests,
    includeE2ETests,
    prototype,
  }
}
