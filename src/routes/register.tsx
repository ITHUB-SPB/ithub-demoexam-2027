import { type SubmitEvent, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
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
                number: formData.get('number') as string,
                fullname: formData.get('fullname') as string,
                login: formData.get('login') as string,
                password: formData.get('password') as string,
            }
        })
        if (!result.success) {
            console.error(result.message)
            setError('Не удалось создать')
            return
        }
        await navigate({ to: "/login" })
    }

    const navigate = Route.useNavigate()
    const [error, setError] = useState<null | string>(null)

    return (
        <div className='page page--auth'>
            <article>
                <h2>Регистрация</h2>
                <p>{error}</p>

                <form className='form' action="" method='post' onSubmit={handleSubmit}>
                    <input type="text" className='input' name='login' placeholder='Логин' pattern='[a-zA-Z0-9]{6,}' required />
                    <p className='error'>Заполните поле (латиница и цифры, не менее 6 символов)</p>

                    <input type="password" className='input' name='password' placeholder='Пароль' minLength={8} required />
                    <p className='error'>Заполните поле (не менее 8 символов)</p>

                    <input type="text" className='input' name='fullname' placeholder='ФИО' pattern='[а-яА-Я ]{3,}' required />
                    <p className='error'>Заполните поле (символы кириллицы и пробелы)</p>

                    <input type="email" className='input' name='email' placeholder='Почта' required />
                    <p className='error'>Заполните поле (формат электронной почты)</p>

                    <input type="text" className='input' name='phone' placeholder='Телефон' pattern='8\(\d{3}\)\d{3}-\d{2}-\d{2}' required />
                    <p className='error'>Заполните поле (формат 8(ххх)ххх-хх-хх)</p>

                    <button className='button-submit' type='submit'>Создать пользователя</button>
                </form>
            </article>
            <Link to='/login'>Уже зарегистрированы? Войти</Link>
        </div>
    )
}
