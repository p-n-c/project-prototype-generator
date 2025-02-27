import { input, select } from '@inquirer/prompts'

import {
  getAllProjectTypes,
  getProjectConfigByType,
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

  const projectAnswers = []

  for (const question of projectConfig?.questions || []) {
    const answer = await getProjectSpecificPrompt(question)
    const projectAnswer = {
      name: question.name,
      response: answer,
    }
    if (!!question.choices) {
      projectAnswer.choice = question.choices.find(
        (choice) => choice.value === answer
      )
    }
    projectAnswers.push(projectAnswer)
  }

  return {
    projectType,
    projectName: projectName?.replace(' ', '-').toLowerCase(),
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
    includeUnitTests,
    includeE2ETests,
    projectAnswers,
  }
}

export const getProjectSpecificPrompt = async (question) => {
  switch (question.type) {
    case 'select':
      return await select({
        message: question.message,
        choices: question.choices,
      })
    case 'input':
      return await input({
        message: question.message,
        default: 'default',
      })
  }
}
