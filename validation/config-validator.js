import { projectConfigSchema } from './project-configuration-schema.js'

export class ConfigValidator {
  constructor(schema) {
    this.schema = schema
    this.errors = []
    this.warnings = []
  }

  validate(config, path = '') {
    this.errors = []
    this.warnings = []
    this._validateObject(config, this.schema, path)
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    }
  }

  _validateObject(config, schema, path) {
    if (!config || typeof config !== 'object') {
      this.errors.push(`Expected object at ${path}, got ${typeof config}`)
      return
    }

    // Check required fields
    Object.entries(schema).forEach(([key, fieldSchema]) => {
      if (fieldSchema.required && !(key in config)) {
        this.errors.push(`Missing required field: ${path}${key}`)
      }
    })

    // Handle dynamic properties if specified
    if (schema.dynamicProperties) {
      Object.entries(config).forEach(([key, value]) => {
        const fieldPath = path ? `${path}.${key}` : key
        this._validateField(value, schema.dynamicProperties, fieldPath)
      })
      return
    }

    // Validate each field against schema
    Object.entries(config).forEach(([key, value]) => {
      const fieldPath = path ? `${path}.${key}` : key
      const fieldSchema = schema[key]
      if (!fieldSchema) {
        // Only warn about unknown fields if we're not using dynamic properties
        if (!schema.dynamicProperties) {
          this.warnings.push(`Unknown field: ${fieldPath}`)
        }
        return
      }

      this._validateField(value, fieldSchema, fieldPath)
    })

    // Check requireOneOf condition if present
    if (schema.requireOneOf) {
      const hasOne = schema.requireOneOf.some((field) => field in config)
      if (!hasOne) {
        this.errors.push(
          `At least one of [${schema.requireOneOf.join(', ')}] is required at ${path}`
        )
      }
    }
  }

  _validateField(value, schema, path) {
    // Handle array of allowed types
    const types = Array.isArray(schema.type) ? schema.type : [schema.type] // !!!!!

    // Type validation
    if (!types.some((type) => this._checkType(value, type))) {
      this.errors.push(
        `Invalid type for ${path}: expected ${types.join('|')}, got ${typeof value}`
      )
      return
    }

    // Pattern validation
    if (schema.pattern && typeof value === 'string') {
      if (!schema.pattern.test(value)) {
        this.errors.push(
          `Invalid format for ${path}: value '${value}' doesn't match pattern ${schema.pattern}`
        )
      }
    }

    // Nested object validation
    if (schema.type === 'object') {
      this._validateObject(value, schema, `${path}.`)
    }

    // Array validation
    if (schema.type === 'array' && Array.isArray(value)) {
      value.forEach((item, index) => {
        if (schema.items) {
          this._validateField(item, schema.items, `${path}[${index}]`)
        }
      })
    }
  }

  _checkType(value, type) {
    switch (type) {
      case 'string':
        return typeof value === 'string'
      case 'number':
        return typeof value === 'number'
      case 'boolean':
        return typeof value === 'boolean'
      case 'object':
        return (
          typeof value === 'object' && value !== null && !Array.isArray(value)
        )
      case 'array':
        return Array.isArray(value)
      default:
        return false
    }
  }
}

// Helper function to validate a single project configuration
export function validateProjectConfig(config) {
  const validator = new ConfigValidator(projectConfigSchema)
  return validator.validate(config)
}

// Helper function to validate all project configurations
export function validateAllProjectConfigs(configs) {
  const results = {}
  Object.entries(configs).forEach(([name, config]) => {
    results[name] = validateProjectConfig(config)
  })
  return results
}
