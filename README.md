# Project prototype generator

A tool for creating simple websites quickly from [People and Code](https://people-and-code.com/).

## Creating a New Project

### Set Up The Project Generator

To run the generator, clone it.

Open a terminal window in the `create-prototype` directory and run `npm link`.

This will give you global access to the project prototype generator.

### Generate a New Web Project

Open a terminal and navigate to where you want to locate your project.

Type `create-prototype` and follow the instructions.

#### Project selection

Select the type of project you want to create.

```shell
What type of project prototype would you like to create? (Use arrow keys)
❯ Web Basic
  Next.js Web App
  Nuxt.js Web App
  Web Article
  People & Code Website
  TypeScript Basic
```

#### Project SetUp

Complete a short setup.

```shell
➜  temp-code create-prototype
✔ What type of project prototype would you like to create? Web Basic
✔ Project name: proof-of-concept
✔ Project title: Proof of Concept
✔ Project description: Demo project for testing a new idea
✔ Project author: People and Code
✔ Include unit tests? Yes
? Include E2E tests? (Use arrow keys)
❯ Yes
  No
```

**Tests**:  
For each project type, you have the option to add dependencies and configuration for either or both unit and e2e tests.
The test runner for unit tests is `jest` and `Cypress` for e2e tests.

Once you have completed the setup, it will take a minute or two to create the project.

```shell
Initialising git repository...
Gathering project files...
Installing dependencies...
This can take a minute or two...
```

Once the project has been built, you will be prompted to run commands to enter the project and run the linters.

```shell
Project "proof-of-concept" has been created successfully.
To get started, run the following commands:

cd proof-of-concept && npm run lint
```

The output will depend on the project but will look something like this:

```shell
> proof-of-concept@0.0.1 lint
> eslint . && prettier --write . --log-level silent
```

If you have set this up, you can open your new project in VS Code using the `code .` shortcut.

### Saving Your New Project In Github

[Adding locally hosted code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

Follow the instructions (copy and paste code suggested in GitHub).

### Tests

#### E2E tests

If you are running e2e tests, Cypress will create several files during setup, including an example test/spec. For this reason, we have not included configuration or example tests in the generator.

---

## New Project Configurations

To add a new configuration, please refer to the [CONTRIBUTING.md](https://github.com/p-n-c/project-prototype-generator/blob/main/CONTRIBUTING.md)
