import { type SubmitEvent, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { login } from '#/lib/login'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  async function handleSubmit(event: SubmitEvent) {}

  const navigate = Route.useNavigate()
  const [error, setError] = useState<null | string>(null)

  return (
    <div className='page'>

    </div>
  )
}
