import path from 'path'
import { fileURLToPath } from 'url'

import { namePattern } from '../validation/utils.js'

export const validateProjectName = (input) => {
  return namePattern.test(input) ? true : 'Project name must use Kebab casing'
}

export const __dirname = path.dirname(fileURLToPath(import.meta.url))
