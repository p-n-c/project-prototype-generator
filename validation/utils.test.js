import { sourcePattern, namePattern } from './utils.js'

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
