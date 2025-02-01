import {
  sourcePattern,
  namePattern,
  srcFolderPattern,
  moduleTypePattern,
} from './utils.js'

describe('sourcePattern', () => {
  const validCases = [
    'index.jsx',
    'page.html',
    'about.tsx',
    'contact-page.jsx',
    'my-component.html',
    'layout.js',
    'styles.css',
    'api-routes.ts',
  ]

  const invalidCases = [
    'Index.jsx', // uppercase not allowed
    '.jsx', // needs a name
    'page', // needs an extension
    'my_page.jsx', // underscore not allowed
    'page.HTML', // uppercase extension
    'contact..jsx', // double dot
    '-page.jsx', // starts with hyphen
    'page-.jsx', // ends with hyphen
    'page.min.js', // multiple dots
    'page space.jsx', // spaces not allowed
  ]

  test.each(validCases)('should match valid filename: %s', (filename) => {
    expect(sourcePattern.test(filename)).toBe(true)
  })

  test.each(invalidCases)(
    'should not match invalid filename: %s',
    (filename) => {
      expect(sourcePattern.test(filename)).toBe(false)
    }
  )
})

// Pattern to match lowercase names with single underscores (no underscores at start/end)

describe('namePattern', () => {
  const validCases = [
    'name',
    'people-and-code',
    'my-component',
    'api-routes',
    'complex-name-with-hyphens',
    'a-b-c',
    'single-letter-a',
  ]

  const invalidCases = [
    '-name', // starts with hyphen
    'name-', // ends with hyphen
    'Name', // uppercase not allowed
    'user__name', // consecutive underscores not allowed
    '-', // just hyphen
    'MY-CONSTANT', // uppercase not allowed
    '', // empty string
    'name-1', // numbers not allowed
    '-hidden-name', // starts with hyphen
    'end-hyphen-', // ends with hyphen
    'camelCase', // uppercase not allowed
    '--name--', // multiple hyphens at start/end
    'test--variable', // consecutive hyphens allowed
    'some__example', // consecutive underscores not allowed
  ]

  test.each(validCases)('should match valid name: %s', (name) => {
    expect(namePattern.test(name)).toBe(true)
  })

  test.each(invalidCases)('should not match invalid name: %s', (name) => {
    expect(namePattern.test(name)).toBe(false)
  })
})

describe('source folder name validation', () => {
  const validCases = [
    'src',
    'app',
    'source',
    'frontend',
    'client',
    'public',
    'assets',
    'www',
    'dist',
    'ui',
  ]

  const invalidCases = [
    'Src', // Case-sensitive (must be lowercase)
    'apps', // Not in the list
    'source-folder', // Extra characters not allowed
    'frontend123', // Numbers not allowed
    'public_assets', // Underscore not allowed
    '', // Empty string
    'client.app', // Dot not allowed
    'dist/', // Slash not allowed
    'main', // Not in the list
  ]

  test.each(validCases)('should allow valid folder name: %s', (folderName) => {
    expect(srcFolderPattern.test(folderName)).toBe(true)
  })

  test.each(invalidCases)(
    'should reject invalid folder name: %s',
    (folderName) => {
      expect(srcFolderPattern.test(folderName)).toBe(false)
    }
  )
})

describe('moduleTypePattern', () => {
  const validCases = ['module', 'commonjs']

  const invalidCases = [
    'Module', // uppercase not allowed
    'CommonJS', // uppercase not allowed
    '', // empty string not allowed
    'other', // invalid value
    'module ', // trailing space not allowed
    ' module', // leading space not allowed
    'common-js', // hyphenated version not allowed
    'esmodule', // partial match not allowed
    null, // null not allowed
    undefined, // undefined not allowed
  ]

  test.each(validCases)('should match valid module type: %s', (type) => {
    expect(moduleTypePattern.test(type)).toBe(true)
  })

  test.each(invalidCases)(
    'should not match invalid module type: %s',
    (type) => {
      expect(moduleTypePattern.test(type)).toBe(false)
    }
  )
})
