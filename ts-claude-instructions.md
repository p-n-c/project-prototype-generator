```
> files-to-prompt ./lib/projects CONTRIBUTING.md --cxml | llm -m claude-3.5-sonnet "Given the examples of projects templates and the contributing instructions, please create a new project template for a basic project using typescript. Include the different files necessary, the directory structure and any instructions necessary to contribute"
```

Certainly! I'll create a new project template for a basic TypeScript project based on the examples and contributing instructions provided. Here's how we can set up the new project template:

1. Project Directory Structure:

```
lib/projects/
└── typescript-basic/
    ├── templates/
    │   ├── ts/
    │   │   └── index.ts
    │   ├── html/
    │   │   └── index.html
    │   ├── css/
    │   │   └── style.css
    │   └── tests/
    │       └── unit/
    │           ├── index.test.ts
    │           └── config/
    │               └── jest.config.json
    └── project-definition.js
```

2. Project Definition File (project-definition.js):

```javascript
export const TYPESCRIPT_BASIC = {
  type: 'typescript-basic',
  name: 'TypeScript Basic',
  description: 'Basic web project with TypeScript and modern tooling',
  templates: {
    html: 'index.html',
    css: ['style.css'],
    ts: ['index.ts'],
  },
  dependencies: {
    base: {
      typescript: 'latest',
      eslint: 'latest',
      prettier: 'latest',
      stylelint: 'latest',
      parcel: 'latest',
      'stylelint-config-standard': 'latest',
      '@typescript-eslint/eslint-plugin': 'latest',
      '@typescript-eslint/parser': 'latest',
      globals: '^15.14.0',
    },
    test: {
      unit: {
        jest: 'latest',
        'ts-jest': 'latest',
        '@types/jest': 'latest',
        '@testing-library/dom': 'latest',
        '@testing-library/user-event': 'latest',
      },
      e2e: {
        cypress: 'latest',
      },
    },
  },
  scripts: {
    base: {
      lint: "eslint . --ext .ts,.js && prettier --write . --log-level silent && stylelint '**/*.css'",
      start: 'parcel src/index.html',
      build: 'parcel build src/index.html',
    },
    test: {
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:e2e': 'cypress open',
      'test:e2e:headless': 'cypress run',
    },
  },
  srcFolder: 'src',
  source: 'index.html',
}
```

3. Template Files:

a. templates/html/index.html:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="{{projectDescription}}" />
    <title>{{projectTitle}}</title>
    <link rel="stylesheet" href="./style.css" />
    <script type="module" src="./index.ts"></script>
  </head>
  <body>
    <h1>Welcome to {{projectTitle}}</h1>
    <p>{{projectDescription}}</p>
  </body>
</html>
```

b. templates/css/style.css:

```css
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 20px;
}
```

c. templates/ts/index.ts:

```typescript
console.log('TypeScript is running!')

// Example function
function greet(name: string): string {
  return `Hello, ${name}!`
}

console.log(greet('World'))
```

d. templates/tests/unit/index.test.ts:

```typescript
import { getByText } from '@testing-library/dom'

describe('Homepage', () => {
  it('displays the main heading', () => {
    document.body.innerHTML = '<h1>Welcome</h1>'
    expect(getByText(document.body, 'Welcome')).toBeTruthy()
  })
})
```

e. templates/tests/unit/config/jest.config.json:

```json
{
  "preset": "ts-jest",
  "testEnvironment": "jsdom",
  "testMatch": ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
  "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
}
```

Instructions to contribute this new TypeScript Basic project template:

1. Create the directory structure as shown above under `lib/projects/typescript-basic/`.
2. Add the `project-definition.js` file with the content provided.
3. Create the template files (HTML, CSS, TypeScript, and test files) in their respective directories.
4. Ensure all necessary dependencies and scripts are included in the project definition.
5. Add any TypeScript-specific configurations, such as `tsconfig.json`, if needed.
6. Update the main generator script to include this new project type in the list of available options.
7. Test the new project template by generating a project and ensuring all files are created correctly and the project runs as expected.
8. Update any relevant documentation to include information about the new TypeScript Basic project template.
9. Submit a pull request with your changes, following the project's contribution guidelines.

By following these steps and using the provided files, you'll have created a new TypeScript Basic project template that fits within the existing structure of the web project generator.

```
> llm -m claude-3.5-sonnet -c "Provide me with a bash script to create the directory structure"
```

Certainly! Here's a bash script that will create the directory structure for the new TypeScript Basic project template:

```bash
#!/bin/bash

# Set the base directory
BASE_DIR="lib/projects/typescript-basic"

# Create the main project directory
mkdir -p "$BASE_DIR"

# Create the templates directory and its subdirectories
mkdir -p "$BASE_DIR/templates/ts"
mkdir -p "$BASE_DIR/templates/html"
mkdir -p "$BASE_DIR/templates/css"
mkdir -p "$BASE_DIR/templates/tests/unit/config"

# Create empty files
touch "$BASE_DIR/project-definition.js"
touch "$BASE_DIR/templates/ts/index.ts"
touch "$BASE_DIR/templates/html/index.html"
touch "$BASE_DIR/templates/css/style.css"
touch "$BASE_DIR/templates/tests/unit/index.test.ts"
touch "$BASE_DIR/templates/tests/unit/config/jest.config.json"

echo "Directory structure for TypeScript Basic project template has been created."
```

To use this script:

1. Save it to a file, for example, `create_typescript_template.sh`.
2. Make the script executable by running: `chmod +x create_typescript_template.sh`
3. Run the script: `./create_typescript_template.sh`

This script will create the entire directory structure and empty files for the TypeScript Basic project template. After running the script, you can populate each file with the content we discussed earlier.

Remember to run this script from the root directory of your project, where the `lib` folder is located. If you're in a different directory, you may need to adjust the `BASE_DIR` variable in the script accordingly.

```
> llm -m claude-3.5-sonnet -c 'Do I need a compiler for typescript or is it included in the setup already?'
```

You're right to ask about this, as TypeScript does require compilation. Looking at the project definition we created, we need to make a few adjustments to ensure TypeScript compilation is properly handled. Here's what we need to consider:

1. TypeScript Compiler: The TypeScript compiler (tsc) is included when you install the 'typescript' package, which is already listed in the base dependencies. However, we're using Parcel as the bundler, which has built-in TypeScript support.

2. Parcel's TypeScript Handling: Parcel 2 (which is likely the 'latest' version) has out-of-the-box support for TypeScript. It uses a custom TypeScript transformer that's faster than the standard TypeScript compiler. This means we don't need to add a separate compilation step for TypeScript when using Parcel.

3. Type Checking: While Parcel will transpile TypeScript, it doesn't perform type checking by default during the build process. For thorough type checking, we should add a separate script.

Given these considerations, let's make a few adjustments to the `project-definition.js`:

```javascript
export const TYPESCRIPT_BASIC = {
  // ... other properties remain the same
  dependencies: {
    base: {
      typescript: 'latest',
      // ... other dependencies remain the same
    },
    // ... test dependencies remain the same
  },
  scripts: {
    base: {
      lint: "eslint . --ext .ts,.js && prettier --write . --log-level silent && stylelint '**/*.css'",
      start: 'parcel src/index.html',
      build: 'parcel build src/index.html',
      typecheck: 'tsc --noEmit',
    },
    test: {
      // ... test scripts remain the same
    },
  },
  // ... other properties remain the same
}
```

Changes made:

1. We've kept the `typescript` package in the base dependencies. This provides the TypeScript compiler and allows us to use it for type checking.

2. We've added a new `typecheck` script that runs `tsc --noEmit`. This script will perform type checking without emitting compiled files.

3. The `start` and `build` scripts use Parcel, which will handle the TypeScript compilation during bundling.

Additionally, we should add a `tsconfig.json` file to the project template to configure TypeScript. Here's a basic `tsconfig.json` you can add:

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

You can add this file to your project structure:

```bash
touch "$BASE_DIR/templates/tsconfig.json"
```

And then add it to the `templates` section of your `project-definition.js`:

```javascript
templates: {
  html: 'index.html',
  css: ['style.css'],
  ts: ['index.ts'],
  other: ['tsconfig.json'],
},
```

With these changes, your TypeScript Basic project template will have everything needed to compile and type-check TypeScript code, while leveraging Parcel for efficient bundling and development workflow.

## Errors

- Had to move tsconfig.json to ./ts and update the project-definition.js to `ts: ['index.ts', 'tsconfig.js']`
