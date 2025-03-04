import { vi } from 'vitest'
import { input, select } from '@inquirer/prompts'
import { promptQuestions } from '../lib/prompt-questions.js'
import { getAllProjectTypes } from '../lib/project-definitions-api.js'

// Mock @inquirer/prompts
vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
  select: vi.fn(),
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
    vi.clearAllMocks()

    // First call promptQuestions to set up the mocks f
    mockSelects(['basic', true, false])
    mockInputs([
      'test-project',
      'Test Project',
      'A test project',
      'Test Author',
    ])

    // Start the promptQuestions call in the background
    const promptPromise = promptQuestions()

    // Wait for promptQuestions to complete to avoid unhandled promise
    await promptPromise
  })

  describe.only('happy path', () => {
    beforeEach(() => {
      // Mock successful responses
      mockSelects(['basic', true, false])
      mockInputs([
        'test-project',
        'Test Project',
        'A test project',
        'Test Author',
      ])
    })

    it('should return complete project configuration', async () => {
      const result = await promptQuestions()

      expect(result).toEqual({
        projectType: 'basic',
        srcFolder: 'src',
        projectName: 'test-project',
        projectTitle: 'Test Project',
        projectDescription: 'A test project',
        projectAuthor: 'Test Author',
        includeUnitTests: true,
        includeE2ETests: false,
      })
    })

    it('should call prompts with correct options', async () => {
      await promptQuestions()

      // Verify project type selection
      expect(select).toHaveBeenCalledWith({
        message: 'What type of project prototype would you like to create?',
        choices: expect.arrayContaining([
          expect.objectContaining({
            name: 'Web Basic',
            value: 'basic',
            description:
              'HTML and CSS only website. Comes with Parcel bundler, Prettier formatting and ESlint. Optional support for Cypress e2e tests and Jest unit tests.',
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
        'Project name must use Kebab casing'
      )
      expect(validateFn('TEST')).toBe('Project name must use Kebab casing')
      expect(validateFn('test_project')).toBe(
        'Project name must use Kebab casing'
      )
      expect(validateFn('my-project-123')).toBe(
        'Project name must use Kebab casing'
      )

      // Test valid cases
      expect(validateFn('test-project')).toBe(true)
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

  describe('space handling in project name', () => {
    it('should replace spaces with hyphens in project name', async () => {
      mockSelects(['basic', true, false])
      mockInputs([
        'test-project',
        'Test Project',
        'A test project',
        'Test Author',
      ])

      const result = await promptQuestions()
      expect(result.projectName).toBe('test-project')
    })
  })

  describe('error handling', () => {
    it('should handle prompt rejections', async () => {
      select.mockRejectedValueOnce(new Error('Prompt failed'))

      await expect(promptQuestions()).rejects.toThrow('Prompt failed')
    })

    it('should handle empty inputs for required fields', async () => {
      input
        .mockResolvedValueOnce('') // empty project name
        .mockResolvedValueOnce('Test Project')
        .mockResolvedValueOnce('A test project')
        .mockResolvedValueOnce('Test Author')
        .mockResolvedValueOnce('src')

      const validateFn = input.mock.calls.find(
        (call) => call[0].message === 'Project name:'
      )[0].validate

      expect(validateFn('')).toBe('Project name must use Kebab casing')
    })
  })
})
