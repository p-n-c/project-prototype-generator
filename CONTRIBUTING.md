# Adding New Project Types

## Table of Contents

- [Adding New Project Types](#adding-new-project-types)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Step-by-Step Guide](#step-by-step-guide)
    - [1. The Project Directory](#1-the-project-directory)
    - [2. Template Variables](#2-template-variables)
    - [3. The Project Definition File](#3-the-project-definition-file)
    - [4. Test Configurations (Optional)](#4-test-configurations-optional)
  - [Available Template Variables](#available-template-variables)
  - [Validation](#validation)

## Overview

This document explains how to add a new project to the project prototype generator.

To create a new project you need to:

1. Create a project directory under `lib/projects`
2. Add templates and configuration files to the project directory
3. Add a project definition file with package.json dependencies, scripts, etc. to the project directory

When you run the generator, your project configuration will get picked up and added to the existing projects.

## Step-by-Step Guide

### 1. The Project Directory

Create a new directory under `projects` with the name of your project. All files specific to your project will go under this.  
When you run the generator, the files in your directory will be mapped to the directory structure in your new project.

Config files will be mapped to the project root.  
The templates structure will be copied as-is e.g. in the example below, `index.html` will appear under `src`.

```text
people-and-code/
├── configs/
│   ├── .vscode/
│   │   └── settings.json
│   ├── .gitignore
│   ├── .stylelintrc.json
│   ├── eslint.config.js
│   └── prettier.config.js
├── templates/
│   └── src/
│       ├── index.html
│       ├── robots.txt
│       ├── sitemap.html
│       └── style.css
└── tests/
    └── unit/
        ├── config/
        │   └── index.test.js
        └── project-definition.js
```

### 2. Template Variables

Use `{{variableName}}` syntax to add dynamic values such as the `projectTitle` chosen when creating a new instance of a project.

```html
<!doctype html>
<html lang="en">
  <head>
    <title>{{projectTitle}}</title>
    <meta name="description" content="{{projectDescription}}" />
  </head>
  ...
</html>
```

Variables will be replaced by project-specific values - entered at the command line during set up - before the file is copied to the new project.

### 3. The Project Definition File

Create a project definition file in your project's root directory. This file will be used to generate the `package.json` when the generator runs.

```javascript
YOUR_PROJECT_TYPE: {
    type: 'your_project_type',      // Unique identifier
    name: 'Display Name',           // User-friendly name
    description: 'Description',     // Shown in project selection
    dependencies: {
        base: {
            // Core dependencies
        },
        test: {
            unit: {
                // Unit test dependencies
            },
            e2e: {
                // E2E test dependencies
            }
        }
    },
    scripts: {
        base: {
            // Recommended core npm scripts
            lint: "eslint . && prettier --write . && stylelint '**/*.{css,scss}'",
            start: 'parcel && npm run static',
        },
        test: {
            // Test-related scripts
        }
    }
}
```

### 4. Test Configurations (Optional)

If your project type supports unit testing:

1. Add Jest configuration in `tests/unit/` and `tests/unit/configs/`:

   ```text
   tests/
   └── unit/
   ├── config/
   │   └── jest.config.json
   └── index.test.ts
   ```

2. Check that your tests have the required dependencies and scripts in the `project-definition`.

## Available Template Variables

The following variables can be used in your templates:

- `{{projectTitle}}`: Project title from user input
- `{{projectDescription}}`: Project description from user input
- `{{currentYear}}`: Current year (auto-populated)

## Validation

You can validate your project configuration using the validation script located in the `validation` directory.

To validate a single config, pass in the config type as an argument:

```shell
node validation/validate-config.js basic
```

To validate all configs, run without arguments:

```shell
node validation/validate-config.js
```

The validation process checks that all required fields are present in your configuration.
