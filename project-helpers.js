export const webBasic = (projectTitle, projectDescription) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta
              name="description"
              content="${projectDescription}"
            />
            <title>${projectTitle}</title>
        </head>
        <body>
            <h1>Welcome to ${projectTitle}</h1>
        </body>
        </html>`
}

export const webArticle = (projectTitle, projectDescription) => {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="${projectDescription}"
      />
      <title>${projectTitle}</title>
      <link rel="stylesheet" href="./style.css" />
    </head>
    <body>
      <header>
        <h1>Article title</h1>
      </header>
      <main>
        <aside>
          <nav aria-labelledby="table-of-contents">
            <h2 id="table-of-contents">Table of contents</h2>
            <p>
              A table of contents is an ordered list of clickable headings
              corresponding to the content sections on the page. It allows users
              to navigate directly to any of the sections on the same page.
            </p>
          </nav>
        </aside>
        <article>
          <h2>Article Heading</h2>
          <p>Article contents...</p>
        </article>
        <aside>
          <nav aria-labelledby="related-articles">
            <h2 id="related-articles">Related articles</h2>
            <p>A list of linked articles on related themes.</p>
          </nav>
        </aside>
      </main>
      <footer><p>&copy; 2024 My Brilliant Articles</p></footer>
  </body>
  </html>`
}
