export const validateProjectName = (input) => {
  return /^[a-z0-9-]+$/.test(input)
    ? true
    : 'Project name can only contain lowercase letters, numbers, and hyphens'
}
