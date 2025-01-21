import { input, select } from '@inquirer/prompts'
import { promptQuestions } from '../lib/prompt-questions.js'
import { getAllProjectTypes } from '../lib/project-types-api.js'

// Mock @inquirer/prompts
jest.mock('@inquirer/prompts', () => ({
  input: jest.fn(),
  select: jest.fn(),
}))

function mockInputs(inputs) {
  inputs.forEach((response) => input.mockResolvedValueOnce(response))
}

function mockSelects(selects) {
  selects.forEach((response) => select.mockResolvedValueOnce(response))
}

describe('promptQuestions', () => {
  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks()

    // First call promptQuestions to set up the mocks f
    mockSelects(['basic', true, false])
    mockInputs([
      'test-project',
      'Test Project',
      'A test project',
      'Test Author',
      'src',
    ])

    // Start the promptQuestions call in the background
    const promptPromise = promptQuestions()

    // Wait for promptQuestions to complete to avoid unhandled promise
    await promptPromise
  })

  describe('happy path', () => {
    beforeEach(() => {
      // Mock successful responses
      mockSelects(['basic', true, false])
      mockInputs([
        'test-project',
        'Test Project',
        'A test project',
        'Test Author',
        'src',
      ])
    })

    it('should return complete project configuration', async () => {
      const result = await promptQuestions()

      expect(result).toEqual({
        projectType: 'basic',
        projectName: 'test-project',
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
        projectAuthor: 'Test Author',
        srcFolder: 'src',
        includeUnitTests: true,
        includeE2ETests: false,
      })
    })

    it('should call prompts with correct options', async () => {
      await promptQuestions()

      // Verify project type selection
      expect(select).toHaveBeenCalledWith({
        message: 'What type of project would you like to create?',
        choices: expect.arrayContaining([
          expect.objectContaining({
            name: 'Web Basic',
            value: 'basic',
            description: 'Basic web project with modern tooling',
          }),
        ]),
      })

      // Verify project name input
      expect(input).toHaveBeenCalledWith({
        message: 'Project name:',
        validate: expect.any(Function),
      })

      // Verify other inputs
      expect(input).toHaveBeenCalledWith({
        message: 'Project title:',
        default: 'test-project',
      })
    })
  })

  describe('project name validation', () => {
    it('should reject invalid project names', async () => {
      // Now we can get the validate function from the mock calls
      const validateFn = input.mock.calls.find(
        (call) => call[0].message === 'Project name:'
      )[0].validate

      // Test invalid cases
      expect(validateFn('Test Project')).toBe(
        'Project name can only contain lowercase letters, numbers, and hyphens'
      )
      expect(validateFn('TEST')).toBe(
        'Project name can only contain lowercase letters, numbers, and hyphens'
      )
      expect(validateFn('test_project')).toBe(
        'Project name can only contain lowercase letters, numbers, and hyphens'
      )

      // Test valid cases
      expect(validateFn('test-project')).toBe(true)
      expect(validateFn('my-project-123')).toBe(true)
    })
  })

  describe('project type choices', () => {
    it('should provide all available project types as choices', async () => {
      const projectTypes = getAllProjectTypes()
      const expectedChoices = Object.values(projectTypes).map((type) => ({
        name: type.name,
        value: type.type,
        description: type.description,
      }))

      expect(select).toHaveBeenCalledWith(
        expect.objectContaining({
          choices: expectedChoices,
        })
      )
    })
  })

  describe('error handling', () => {
    it('should handle prompt rejections', async () => {
      select.mockRejectedValueOnce(new Error('Prompt failed'))

      await expect(promptQuestions()).rejects.toThrow('Prompt failed')
    })

    it('should handle empty inputs for required fields', async () => {
      mockSelects(['basic', true, false])

      input
        .mockResolvedValueOnce('') // empty project name
        .mockResolvedValueOnce('Test Project')
        .mockResolvedValueOnce('A test project')
        .mockResolvedValueOnce('Test Author')
        .mockResolvedValueOnce('src')

      const validateFn = input.mock.calls.find(
        (call) => call[0].message === 'Project name:'
      )[0].validate

      expect(validateFn('')).toBe(
        'Project name can only contain lowercase letters, numbers, and hyphens'
      )
    })
  })

  describe('space handling in project name', () => {
    it('should replace spaces with hyphens in project name', async () => {
      mockSelects(['basic', true, false])

      input
        .mockResolvedValueOnce('test project') // name with space
        .mockResolvedValueOnce('Test Project')
        .mockResolvedValueOnce('A test project')
        .mockResolvedValueOnce('Test Author')
        .mockResolvedValueOnce('src')

      const result = await promptQuestions()
      expect(result.projectName).toBe('test-project')
    })
  })
})
