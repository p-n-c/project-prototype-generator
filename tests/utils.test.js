import { validateProjectName } from '../lib/utils.js'

describe('validateProjectName', () => {
  it('should validate correct project names', () => {
    expect(validateProjectName('test-project')).toBe(true)
    expect(validateProjectName('my-project-123')).toBe(true)
  })

  it('should reject incorrect project names', () => {
    expect(validateProjectName('Test Project')).toBe(
      'Project name can only contain lowercase letters, numbers, and hyphens'
    )
  })
})
