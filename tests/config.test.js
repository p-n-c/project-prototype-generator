import {
  getAllProjectTypes,
  getProjectConfigByType,
  getProjectDependencies,
  getProjectScripts,
} from '../lib/project-definitions-api.js'

describe('Project Types Configuration', () => {
  describe('getAllProjectTypes', () => {
    it('should return all project types with correct structure', () => {
      const projectTypes = getAllProjectTypes()

      expect(projectTypes.BASIC).toBeDefined()
      expect(projectTypes.BASIC.type).toBe('basic')
      expect(projectTypes.BASIC.name).toBe('Web Basic')
      expect(projectTypes.BASIC.description).toBe(
        'Basic web project with modern tooling'
      )

      // Verify essential properties exist
      expect(projectTypes.BASIC.templates).toBeDefined()
      expect(projectTypes.BASIC.dependencies).toBeDefined()
      expect(projectTypes.BASIC.scripts).toBeDefined()
    })
  })

  describe('getProjectConfigByType', () => {
    it('should return correct configuration for basic type', () => {
      const config = getProjectConfigByType('basic')

      expect(config).toBeDefined()
      expect(config.type).toBe('basic')
      expect(config.templates.html).toBe('index.html')
      expect(config.dependencies.base).toHaveProperty('eslint')
      expect(config.scripts.base).toHaveProperty('lint')
    })
  })

  describe('getProjectDependencies', () => {
    const basicConfig = getProjectConfigByType('basic')

    it('should return base dependencies when no tests are included', () => {
      const deps = getProjectDependencies(basicConfig, {
        includeUnitTests: false,
        includeE2ETests: false,
      })

      expect(deps).toEqual(basicConfig.dependencies.base)
      expect(deps).toHaveProperty('eslint')
      expect(deps).not.toHaveProperty('jest')
      expect(deps).not.toHaveProperty('cypress')
    })

    it('should include unit test dependencies when specified', () => {
      const deps = getProjectDependencies(basicConfig, {
        includeUnitTests: true,
        includeE2ETests: false,
      })

      expect(deps).toHaveProperty('jest')
      expect(deps).toHaveProperty('@testing-library/dom')
      expect(deps).not.toHaveProperty('cypress')
    })

    it('should include e2e test dependencies when specified', () => {
      const deps = getProjectDependencies(basicConfig, {
        includeUnitTests: false,
        includeE2ETests: true,
      })

      expect(deps).toHaveProperty('cypress')
      expect(deps).not.toHaveProperty('jest')
    })
  })

  describe('getProjectScripts', () => {
    const basicConfig = getProjectConfigByType('basic')

    it('should return base scripts when no tests are included', () => {
      const scripts = getProjectScripts(basicConfig, {
        includeUnitTests: false,
        includeE2ETests: false,
      })

      expect(scripts).toEqual(basicConfig.scripts.base)
      expect(scripts).toHaveProperty('lint')
      expect(scripts).not.toHaveProperty('test')
      expect(scripts).not.toHaveProperty('test:e2e')
    })

    it('should include test scripts when tests are included', () => {
      const scripts = getProjectScripts(basicConfig, {
        includeUnitTests: true,
        includeE2ETests: true,
      })

      expect(scripts).toHaveProperty('test')
      expect(scripts).toHaveProperty('test:watch')
      expect(scripts).toHaveProperty('test:e2e')
      expect(scripts).toHaveProperty('test:e2e:headless')
    })
  })
})
