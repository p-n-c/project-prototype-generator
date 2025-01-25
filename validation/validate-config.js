#!/usr/bin/env node
/* eslint-disable no-undef */
import { getAllProjectTypes } from '../lib/project-definitions-api.js'
import {
  validateProjectConfig,
  validateAllProjectConfigs,
} from './config-validator.js'

// Validate a single project type if specified as argument
const projectType = process.argv[2]
if (projectType) {
  const config = getAllProjectTypes()[projectType.toUpperCase()]
  if (!config) {
    console.error(`Project type '${projectType}' not found`)
    process.exit(1)
  }

  const result = validateProjectConfig(config)
  console.log(`\nValidation results for ${projectType}:`)
  console.log('Valid:', result.isValid)
  if (result.errors.length > 0) {
    console.log('\nErrors:')
    result.errors.forEach((error) => console.log(`- ${error}`))
  }
  if (result.warnings.length > 0) {
    console.log('\nWarnings:')
    result.warnings.forEach((warning) => console.log(`- ${warning}`))
  }

  process.exit(result.errors.length > 0 ? 1 : 0)
}

// Validate all project types if no argument provided
const results = validateAllProjectConfigs(getAllProjectTypes())
let hasErrors = false

console.log('\nValidation results for all project types:')
Object.entries(results).forEach(([name, result]) => {
  console.log(`\n${name}:`)
  console.log('Valid:', result.isValid)

  if (result.errors.length > 0) {
    hasErrors = true
    console.log('Errors:')
    result.errors.forEach((error) => console.log(`- ${error}`))
  }
  if (result.warnings.length > 0) {
    console.log('Warnings:')
    result.warnings.forEach((warning) => console.log(`- ${warning}`))
  }
})

process.exit(hasErrors ? 1 : 0)
