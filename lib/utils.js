import { namePattern } from '../validation/utils.js'

export const validateProjectName = (input) => {
  return namePattern.test(input) ? true : 'Project name must use Kebab casing'
}
