import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'

const exec = promisify(execCallback)

export class FileOperations {
  constructor(projectRoot, templateRoot, getProjectConfigByType) {
    this.projectRoot = projectRoot
    this.templateRoot = templateRoot
    this.getProjectConfigByType = getProjectConfigByType
  }

  async createProjectStructure(projectConfig, options) {
    const { projectPath, srcFolder, includeUnitTests, includeE2ETests } =
      options

    try {
      // Create base directories
      await fs.ensureDir(projectPath)
      await fs.ensureDir(path.join(projectPath, srcFolder))

      // Initialise git
      await this.initGit(projectPath)

      // Copy base configuration files
      await this.copyBaseConfigs(
        projectConfig,
        projectPath,
        includeUnitTests,
        includeE2ETests
      )

      // Copy project-specific templates
      await this.copyProjectTemplates(projectConfig, projectPath, options)
      // Copy project-specific configs
      await this.copyConfigTemplates(projectConfig, projectPath)

      return true
    } catch (e) {
      console.error('Error creating project structure:', e)
      throw e
    }
  }

  async initGit(projectPath) {
    try {
      await fs.ensureDir(projectPath)
      await exec('git init', { cwd: projectPath })
    } catch (e) {
      console.error('Error initialising git:', e)
      throw e
    }
  }

  async copyBaseConfigs(
    projectConfig,
    projectPath,
    includeUnitTests,
    includeE2ETests
  ) {
    try {
      const commonConfigFiles = {
        '.gitignore': 'configs/.gitignore',
        'prettier.config.js': 'configs/prettier.config.js',
        '.stylelintrc.json': 'configs/.stylelintrc.json',
        '.vscode/settings.json': 'configs/.vscode/settings.json',
      }
      for (const [dest, src] of Object.entries(commonConfigFiles)) {
        const _src = path.join(this.templateRoot, src)
        const _dest = path.join(projectPath, dest)
        await fs.copy(_src, _dest)
      }

      // Check for configs to be ignored
      const ignoreESLint = projectConfig?.ignores?.find((i) => i === 'eslint')
      if (ignoreESLint) return
      const conditionalPath =
        includeUnitTests || includeE2ETests ? 'with-tests' : 'without-tests'
      const src = path.join(
        this.templateRoot,
        'configs',
        'eslint',
        conditionalPath,
        'eslint.config.js'
      )
      const dest = path.join(projectPath, 'eslint.config.js')
      await fs.copy(src, dest)
    } catch (e) {
      console.error('Error copying base configs:', e)
      throw e
    }
  }

  async copyProjectTemplates(projectConfig, projectPath, options) {
    try {
      const { srcFolder } = options

      const project = await this.getProjectConfigByType(projectConfig.type)
      const templates = project.templates
      for (const [fileType, files] of Object.entries(templates)) {
        if (Array.isArray(files)) {
          for (const file of files) {
            await this.copyTemplate(
              fileType,
              projectConfig.type,
              file,
              projectPath,
              srcFolder,
              options
            )
          }
        } else if (files) {
          await this.copyTemplate(
            fileType,
            projectConfig.type,
            files,
            projectPath,
            srcFolder,
            options
          )
        }
      }
    } catch (e) {
      console.error('Error copying project templates:', e)
      throw e
    }
  }

  async copyConfigTemplates(projectConfig, projectPath) {
    try {
      const project = await this.getProjectConfigByType(projectConfig.type)
      const configs = project.configs
      if (Array.isArray(configs)) {
        for (const config of configs) {
          await this.copyConfig(projectConfig.type, config, projectPath)
        }
      } else if (configs) {
        await this.copyConfig(projectConfig.type, configs, projectPath)
      }
    } catch (e) {
      console.error('Error copying project configs:', e)
      throw e
    }
  }

  async copyTemplate(
    fileType,
    projectType,
    filename,
    projectPath,
    srcFolder,
    options
  ) {
    try {
      const templatePath = path.join(
        this.templateRoot,
        'projects',
        projectType, // e.g. basic, article
        'templates',
        fileType, // e.g. html, css
        filename // e.g. index.html, style.css
      )
      const destPath = path.join(projectPath, srcFolder, filename)

      let content = await fs.readFile(templatePath, 'utf8')

      content = this.processTemplateVariables(content, {
        projectTitle: options.projectTitle,
        projectDescription: options.projectDescription,
        currentYear: new Date().getFullYear(),
      })

      await fs.outputFile(destPath, content)
    } catch (e) {
      console.error('Error copying template:', e)
      throw e
    }
  }

  async copyConfig(projectType, config, projectPath) {
    try {
      const templatePath = path.join(
        this.templateRoot,
        'projects',
        projectType, // e.g. basic, article
        'configs',
        config // e.g. index.html, style.css
      )
      const destPath = path.join(projectPath, config)

      let content = await fs.readFile(templatePath, 'utf8')

      await fs.outputFile(destPath, content)
    } catch (e) {
      console.error('Error copying config:', e)
      throw e
    }
  }

  async writeJson(projectPath, packageJson) {
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageJson)
    )
  }

  getFilesInDirectory(directoryPath) {
    try {
      // Read all files in the directory
      const files = fs.readdirSync(directoryPath)

      // Filter out only files (not subdirectories)
      const fileList = files.filter((file) =>
        fs.statSync(path.join(directoryPath, file)).isFile()
      )

      return fileList
    } catch (error) {
      console.error('Error reading directory:', error)
      return []
    }
  }

  processTemplateVariables(content, variables) {
    return content.replace(
      /\{\{(\w+)\}\}/g,
      (match, variable) => variables[variable] || match
    )
  }
}
