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
      name: 'Conceptual',
      value: 'Conceptual',
      description: 'Explores and validates initial ideas and approaches',
      questions: [
        'Who am I doing this for? Myself, my team, the company, clients?',
        'Do I have a clear objective?',
        'Are there limiting factors? These might include scope, time or resources.',
        'Does it depend on research? If so, have I supplied it.',
        'Is the concept limited to one domain or field such as business, interoperability or use experience?',
        'What problem am I trying to solve?',
        'Are there existing solutions I can learn from?',
        'What would success look like for this project?',
        'What assumptions am I making that should be validated?',
      ],
    },
    {
      name: 'Horizontal',
      value: 'Horizontal',
      description:
        'Implements a broad slice of functionality across multiple features, typically focusing on user interface and experience',
      questions: [
        'Is this a high level overview of a project?',
        'Is it designed to test interoperability?',
        'Have I outlined, or stubbed, the elements I want to connect?',
        'Am I solving for one or many user stories or flows? If not, what is my objective.',
        'Are there any dependencies I want to exclude? Are there that are implicit or explicit?',
        'What are the primary interfaces between components?',
        'How will different parts of the system communicate?',
        'Are there performance or scalability considerations across the system?',
        'What shared resources or services will be needed?',
      ],
    },
    {
      name: 'Vertical',
      value: 'Vertical',
      description:
        'Implements a narrow slice of complete functionality from user interface through to data storage',
      questions: [
        'Have I provided stubs or definitions for any dependencies?',
        'Do I require input from more than one person or LLM?',
        'Do I need e2e or interaction tests? What environment will they run in?',
        'Am I considering only the happy path?',
        'Do I need to provide an initial state?',
        'What data flows through this vertical slice?',
        'Are there security considerations specific to this functionality?',
        'Does this slice need to integrate with external systems?',
        'What monitoring or logging is needed for this functionality?',
      ],
    },
    {
      name: 'Functional',
      value: 'Functional',
      description:
        'Validates specific functional requirements or technical approaches',
      questions: [
        'Have I defined the environment where the code will run e.g. Node.js or web?',
        'Have I specified the language I want to use?',
        'Have I supplied the context e.g. files, functions, requirements, or a README?',
        'What dependencies, if any, do I anticipate using.',
        'How will I validate code generated e.g. with tests. If so, what environment will they run in?',
        'Are there specific performance requirements?',
        'What error handling strategy should be implemented?',
        'Are there specific patterns or architectural approaches to follow?',
        'Does this need to be compatible with specific versions or platforms?',
      ],
    },
    {
      name: 'Visual',
      value: 'Visual',
      description:
        'A non-functional prototype focused on the design, layout, and user interface to gather feedback on aesthetics and usability',
      questions: [
        'Have I supplied any designs.',
        'Do I expect visual responses? If so, in what format.',
        'If I am using an LLM, have I selected the most appropriate',
        'What level of fidelity do I want.',
        'Do I want interactive or static responses?',
        'Are there brand guidelines or design systems to adhere to?',
        'What user accessibility requirements need to be considered?',
        'Should responsive design be implemented, and for which viewports?',
        'Are there specific user interactions or animations that are important?',
        'What visual feedback is needed for user actions?',
      ],
    },
  ]
}
