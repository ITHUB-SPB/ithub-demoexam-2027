import { type SubmitEvent, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'

// import { getUser } from '#/lib/login'
// import { createEntry } from '#/lib/entries';

export const Route = createFileRoute('/')({
  beforeLoad: async () => { },
  loader: async ({ context }) => { },
  component: Home
})

function Home() {
  const login = Route.useLoaderData()

  const handleSubmit = async (event: SubmitEvent) => { }

  const [error, setError] = useState<null | string>(null)

  return (
    <div className='page'>

    </div>
  )
}
