'use client'

import { useFlags } from 'launchdarkly-react-client-sdk'

import LDProvider from '@/components/LDProvider'

const clientContext = {
  clientSideID: process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID,
  context: {
    kind: 'user',
    key: 'user-key-123abc',
    name: 'Sandy Smith',
  },
  options: {},
}

const Flags = () => {
  const flags = useFlags()
  const flagItems = Object.keys(flags).map((key) => {
    return (
      <li key={key}>
        {String(key)}: {String(flags[key])}
      </li>
    )
  })

  return (
    <>
      <h1>Flags</h1>
      <ul>{flagItems}</ul>
    </>
  )
}

const Page = () => {
  return (
    <LDProvider {...clientContext}>
      <Flags />
    </LDProvider>
  )
}

export default Page
