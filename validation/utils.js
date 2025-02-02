// Pattern to match filenames like index.jsx, page.html, etc.
export const sourcePattern = /^(?:(?!-)[a-z]+(?:-[a-z]+)*\.(jsx|html|[a-z]+))?$/

// This pattern breaks down as:

// ^ - start of string
// (?!-) - negative lookahead to prevent leading hyphen
// [a-z]+ - one or more lowercase letters
// (?:-[a-z]+)* - zero or more groups of a hyphen followed by lowercase letters
// \. - literal dot
// (jsx|html|[a-z]+) - specific extensions or any lowercase extension
// $ - end of string

// Pattern to match lowercase names with single underscores (no underscores at start/end)
export const namePattern = /^(?!-)(?!.*--)[a-z]+(-[a-z]+)*(?<!-)$/

// The pattern breaks down as:

// ^(?!-): Ensures the name does not start with a hyphen.
// (?!.*--): Disallows consecutive hyphens anywhere in the string.
// [a-z]+: Matches one or more lowercase letters.
// (-[a-z]+)*: Allows optional segments of a hyphen followed by lowercase letters.
// (?<!-)$: Ensures the name does not end with a hyphen.

// Pattern to match top ten most common source folder names (src, app, source, frontend, client, public, assets, www, dist, ui)
export const srcFolderPattern =
  /^(src|app|source|frontend|client|public|assets|www|dist|ui||)$/

// Regular expression to match either "module" or "commonjs"
export const moduleTypePattern = /^(module|commonjs)$/
