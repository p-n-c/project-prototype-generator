import React from 'react'

export const metadata = {
  title: '{{projectTitle}}',
  description: '{{projectDescription}}',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
