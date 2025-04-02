'use client'

import Link from 'next/link'

const Home = () => {
  return (
    <>
      <h1>CI/CD prototype project</h1>
      <p>
        <Link href="/about">About</Link>
      </p>
      <p>
        See LaunchDarkly <Link href="/flags">flags</Link>
      </p>
    </>
  )
}

const Page = () => {
  return <Home />
}

export default Page
