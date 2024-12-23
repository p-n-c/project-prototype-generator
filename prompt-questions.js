export const promptQuestions = async (input, select) => {
  // First, ask for the project type
  const projectType = await select({
    message: 'Project type:',
    choices: [
      { name: 'Web basic', value: 'web' },
      { name: 'Web next', value: 'web-next' },
      { name: 'Web article', value: 'web-article' },
      { name: 'People & Code website', value: 'web-people-and-code' },
    ],
    default: 'web',
  })
  const projectName = await input({
    message: 'Project name:',
    default: 'my-new-project',
  })
  const projectTitle = await input({
    message: 'Project title:',
    default: '',
  })
  const projectDescription = await input({
    message: 'Project description:',
    default: '',
  })
  const projectAuthor = await input({
    message: 'Project author:',
    default: '',
  })
  const srcFolder = await input({
    message: 'Source folder name:',
    default: 'src',
  })

  return {
    projectType,
    projectName: projectName.replace(' ', '-'),
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
  }
}
