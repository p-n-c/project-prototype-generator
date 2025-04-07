import './global.css'

export const metadata = {
  title: '{{projectTitle}}',
  description: '{{projectDescription}}',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <header>I'm the header in the root layout</header>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
        <footer>I'm the footer in the root layout</footer>
      </body>
    </html>
  )
}

export default RootLayout
