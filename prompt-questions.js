export const promptQuestions = async (input, select) => {
  // First, ask for the project type
  const projectType = await select({
    message: 'Project type:',
    choices: [
      { name: 'Web basic', value: 'web' },
      { name: 'Web article', value: 'web-article' },
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
    projectName,
    projectTitle,
    projectDescription,
    projectAuthor,
    srcFolder,
  }
}
