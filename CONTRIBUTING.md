# Adding New Project Types

This document explains how to add a new project type to the web project generator.

Adding a new project type requires:

1. Configuration in `project-types.js`
2. Template files
3. Test configuration files (if supporting tests)

## Step-by-Step Guide

### 1. Add Project Configuration

In `project-types.js`, add a new entry to `PROJECT_TYPES`:

```javascript
YOUR_PROJECT_TYPE: {
    type: 'your_project_type',    // Unique identifier
    name: 'Display Name',         // User-friendly name
    description: 'Description',   // Shown in project selection
    templates: {
        html: 'index.html',       // Main template files
        css: ['style.css'],       // Array for multiple files
        other: [],                // Optional extra files e.g. page.jsx
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

### 2. Create Template Files

1. Create sub directories for your project type in `templates/` for each section. If you have files other than `html`, `css` or tests files, use `other` e.g. `templates/other/next/layout.jsx`.

   ```text
   templates/
   ├── html/
   │   └── your_project_type/
   │       └── index.html
   ├── css/
   │   └── your_project_type/
   │       └── style.css
   └── tests/
       └── unit/
           └── your_project_type/
               └── index.test.js
   ```

2. Add template files with variables using `{{variableName}}` syntax

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

## Validation

You can run a basic validation of your project configuration.

You can validate a single config by passing in the config type as an argument e.g. `basic` or with no arguments to validate all configs.

```shell
node validation/validate-config.js basic
node validation/validate-config.js
```

Validation checks that all required fields are present.
