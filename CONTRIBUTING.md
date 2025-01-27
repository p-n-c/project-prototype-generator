# Adding New Project Types

This document explains how to add a new project to the web project generator.

To create a new project you need to:

1. Create a project directory under `lib/projects`
2. Add a project definition file with properties that match the project directory structure
3. Add templates and configuration files

When you run the generator, your project definition will get picked up and added to the existing projects.

## Step-by-Step Guide

### 1. The Project Directory

1. Create a new directory under `projects` with the name of your project. All files specific to your project will go under this.  
   Add files in folders of your choice e.g. `html`, `css`, `jsx` e.g. `templates/basic/html/index.html`.

   ```text
   projects/
   └── basic/                               -- required name
    ├── templates/                          -- required name
    │   ├── html/
    │   │   └── index.html
    │   └── tests/                          -- required name
    │       └── unit/                       -- required name
    │           ├── index.test.js
    │           └── config/                 -- required name
    │               └── jest.config.json
    └── project-definition.js               -- required name
   ```

This file structure is reflected in the `project-definition.js` file e.g.

```json
{
  "templates": {
    "html": "index.html"
  }
}
```

The relationship between the project definition and the directory structure is by convention but it will be checked in the unit tests.

1. Add template files with variables using `{{variableName}}` syntax

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

Variables will be replaced by project-specific values before the file is copied to the new project.

### 2. The Project Definition File

Your project definition file will get picked up when the generator runs, and your project will be added to list of project types from which people can select.

```javascript
YOUR_PROJECT_TYPE: {
    type: 'your_project_type',      // Unique identifier
    name: 'Display Name',           // User-friendly name
    description: 'Description',     // Shown in project selection
    templates: {
        html: 'index.html',         // Main template files
        css: ['style.css'],         // Array for multiple files
        jsx: [],                    // Optional extra files e.g. page.jsx
    },
    dependencies: {
        base: {
            // Core dependencies
            eslint: 'latest',
            prettier: 'latest',
            // ...other dependencies
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
            // Core npm scripts
            lint: "eslint . && prettier --write . && stylelint '**/*.{css,scss}'",
            start: 'parcel && npm run static',
        },
        test: {
            // Test-related scripts
        }
    }
}
```

### 3. Add Test Configurations (Optional)

If your project type supports testing:

1. Add Jest configuration in `configs/jest/your_project_type/`:

   ```text
   configs/
   └── jest/
       └── your_project_type/
           ├── jest.config.json
           └── jest.setup.js (if needed)
   ```

2. Add test templates in `templates/tests/unit/your_project_type/`

## Available Template Variables

- `{{projectTitle}}`: Project title from user input
- `{{projectDescription}}`: Project description from user input
- `{{currentYear}}`: Current year (auto-populated)

### Tips and Hints

- If you don't want eslint configuration, add an ignore command e.g. `ignores: ['eslint']`. Next.js, for example, incorporates setup for eslint.

## Validation

You can run a basic validation of your project configuration.

You can validate a single config by passing in the config type as an argument e.g. `basic` or with no arguments to validate all configs.

```shell
node validation/validate-config.js basic
node validation/validate-config.js
```

Validation checks that all required fields are present.
