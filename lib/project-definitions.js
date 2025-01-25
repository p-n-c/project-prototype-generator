import { BASIC } from './basic/project-definition.js'
import { NEXT } from './next/project-definition.js'
import { ARTICLE } from './article/project-definition.js'
import { PEOPLE_AND_CODE } from './people-and-code/project-definition.js'

export const PROJECT_DEFINITIONS = {
  BASIC: { ...BASIC },
  NEXT: { ...NEXT },
  ARTICLE: { ...ARTICLE },
  PEOPLE_AND_CODE: { ...PEOPLE_AND_CODE },
}
