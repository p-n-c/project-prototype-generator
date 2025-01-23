import { input, select } from '@inquirer/prompts'

import {
  getAllProjectTypes,
  getProjectConfigByType,
} from './project-types-api.js'
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
    message: 'What type of project would you like to create?',
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
  })

  const projectAuthor = await input({
    message: 'Project author:',
  })

  const srcFolder = getProjectConfigByType(projectType)?.srcFolder || 'src'

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
    projectName: projectName?.replace(' ', '-').toLowerCase(),
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
    includeUnitTests,
    includeE2ETests,
  }
}
