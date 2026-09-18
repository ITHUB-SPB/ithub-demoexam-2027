import { type SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { register } from '#/lib/register'

export const Route = createFileRoute('/register')({
    component: RouteComponent,
})

function RouteComponent() {
    async function handleSubmit(event: SubmitEvent) {
        const formData = new FormData(event.target)

        const result = await register({
            data: {
                email: formData.get('email') as string,
                login: formData.get('login') as string,
                password: formData.get('password') as string,
                fullname: formData.get('fullname') as string,
                phone: formData.get('phone') as string,
            }
        })

        if (result.success === false) {
            return // TODO DISPLAY ERROR
        }

        await navigate({ to: '/login' })
    }

    const navigate = Route.useNavigate()

    return (
        <div>
            <form action="" method="post" onSubmit={handleSubmit}>
                <input type="text" name="login" placeholder='Логин' required />
                <input type="password" name="password" placeholder='Пароль' required />
                <input type="text" name="fullname" placeholder='ФИО' required />
                <input type="email" name="email" placeholder='Почта' required />
                <input type="tel" name="phone" placeholder='Телефон' required />
                <button type="submit">Отправить</button>
            </form>
        </div>
    )
}
