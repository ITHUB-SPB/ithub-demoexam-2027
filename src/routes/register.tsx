import { type SubmitEvent, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { register } from '#/lib/register'

export const Route = createFileRoute('/register')({
    component: RouteComponent,
})

function RouteComponent() {
    async function handleSubmit(event: SubmitEvent) { }

    const navigate = Route.useNavigate()
    const [error, setError] = useState<null | string>(null)

    return (
        <div className='page'>

        </div>
    )
}
