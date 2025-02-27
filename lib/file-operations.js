import fs from 'fs-extra'
import path from 'path'
import { promisify } from 'util'
import { exec as execCallback } from 'child_process'
import { readdir } from 'node:fs/promises'

const exec = promisify(execCallback)

export class FileOperations {
  constructor(projectRoot, templateRoot, getProjectConfigByType) {
    this.projectRoot = projectRoot
    this.templateRoot = templateRoot
    this.getProjectConfigByType = getProjectConfigByType
  }

  async createProjectStructure(projectConfig, options) {
    const { projectPath, srcFolder } = options

    try {
      // Create base directories
      await fs.ensureDir(projectPath)
      await fs.ensureDir(path.join(projectPath, srcFolder))

      // Initialise git
      await this.initGit(projectPath)

      // Copy project-specific templates
      await this.copyProjectTemplates(projectConfig, projectPath, options)
      // Copy project-specific configs
      await this.copyConfigTemplates(projectConfig, projectPath)

      // Copy prompt template and customise
      const project = await this.getProjectConfigByType(projectConfig.type)
      const templatesPath = path.join(
        this.templateRoot,
        'projects',
        project.type,
        'templates/artefacts'
      )
      const templates = this.getFilesInDirectory(templatesPath, {
        recursive: true,
      })

      // Check the project has a prompt template
      if (templates.length) {
        await this.copyPromptTemplate(
          project.type,
          templates[0], // We'll only ever be looking at one template
          projectPath,
          options
        )
      }

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

  async copyProjectTemplates(projectConfig, projectPath, options) {
    try {
      const project = await this.getProjectConfigByType(projectConfig.type)
      const templatesPath = path.join(
        this.templateRoot,
        'projects',
        project.type,
        'templates'
      )
      const templates = this.getFilesInDirectory(templatesPath, {
        recursive: true,
      })
      for (const template of templates) {
        await this.copyTemplate(
          projectConfig.type,
          template,
          projectPath,
          options
        )
      }
    } catch (e) {
      console.error('Error copying project templates:', e)
      throw e
    }
  }

  async copyConfigTemplates(projectConfig, projectPath) {
    try {
      const project = await this.getProjectConfigByType(projectConfig.type)
      const configsPath = path.join(
        this.templateRoot,
        'projects',
        project.type,
        'configs'
      )
      const configs = this.getFilesInDirectory(configsPath, { recursive: true })
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

  async copyTemplate(projectType, template, projectPath, options) {
    try {
      const templatePath = path.join(
        this.templateRoot,
        'projects',
        projectType, // e.g. basic, article
        'templates',
        template // e.g. index.html, style.css
      )
      const destPath = path.join(projectPath, template)
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

  async copyPromptTemplate(projectType, template, projectPath, options) {
    try {
      const templatePath = path.join(
        this.templateRoot,
        'projects',
        projectType, // e.g. next-prototype-builder
        'templates/artefacts',
        template // e.g. prompt-template.json
      )

      // Copy the prompt template
      const promptTemplate = await fs.readFile(templatePath)
      const prompt = JSON.parse(promptTemplate)

      // Customise the prompt
      prompt.project.title = options.projectTitle
      prompt.project.description = options.projectDescription

      // Prototype values
      const prototype = options?.projectAnswers.find(
        (answers) => answers.name === 'prototypeType'
      )
      prompt.prototype.type = prototype.response
      prompt.prototype.typeDefinition = prototype?.choice?.description

      const destPath = path.join(projectPath, 'artefacts', template)
      await fs.outputFile(destPath, JSON.stringify(prompt))
    } catch (e) {
      console.error('Error copying template:', e)
      throw e
    }
  }

  async copyConfig(projectType, config, projectPath) {
    try {
      const configPath = path.join(
        this.templateRoot,
        'projects',
        projectType, // e.g. basic, article
        'configs',
        config // e.g. index.html, style.css
      )
      const destPath = path.join(projectPath, config)
      const stat = await fs.statSync(configPath)
      if (stat.isFile()) {
        let content = await fs.readFile(configPath, 'utf8')

        await fs.outputFile(destPath, content)
      }
    } catch (e) {
      console.error('Error copying config:', e)
      throw e
    }
  }

  async writeJson(projectPath, json, fileName) {
    await fs.writeFile(path.join(projectPath, fileName), JSON.stringify(json))
  }

  getFilesInDirectory(directoryPath, options) {
    try {
      // Read all files in the directory
      const files = fs.readdirSync(directoryPath, options)
      // Filter out only files (not subdirectories)
      const fileList = files.filter((file) =>
        fs.statSync(path.join(directoryPath, file)).isFile()
      )
      return fileList
    } catch (error) {
      // console.error('Error reading directory:', error)
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
