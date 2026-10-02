import { type FormEvent, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { login } from '../lib/login'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = Route.useNavigate()
    const [error, setError] = useState<null | string>(null)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)
        const loginValue = String(formData.get('login') ?? '')
        const passwordValue = String(formData.get('password') ?? '')

        const result = await login({
            data: {
                login: loginValue,
                password: passwordValue,
            }
        })

        if (!result?.success) {
            setError(result.message)
            return
        }

        await navigate({ to: '/index' })
    }

    return (
        <div className='page page--auth'>
            <article>
                <h2>Авторизация</h2>
                {error && <p className="error-summary">{error}</p>}

                <form className="form" onSubmit={handleSubmit}>
                    <input className="input" type="text" name="login" placeholder='Логин' required />

                    <input className="input" type="password" name="password" placeholder='Пароль' required />

                    <button className="button-submit" type="submit">Отправить</button>
                </form>
            </article>
        </div>
    )
}