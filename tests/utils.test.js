import { validateProjectName } from '../lib/utils.js'

describe('validateProjectName', () => {
  it('should validate correct project names', () => {
    expect(validateProjectName('test-project')).toBe(true)
  })

  it('should reject incorrect project names', () => {
    expect(validateProjectName('Test Project')).toBe(
      'Project name must use Kebab casing'
    )
    expect(validateProjectName('my-project-123')).toBe(
      'Project name must use Kebab casing'
    )
  })
})
