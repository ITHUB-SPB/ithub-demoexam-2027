import { type FormEvent, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { register } from '../lib/register'

export const Route = createFileRoute('/register')({
    component: RouteComponent,
})

function RouteComponent() {
    const [error, setError] = useState<null | string>(null)

    const navigate = useNavigate()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const result = await register({
            data: {
                email: formData.get('email') as string,
                login: formData.get('login') as string,
                password: formData.get('password') as string,
                fullname: formData.get('fullname') as string,
                phoneNumber: formData.get('phoneNumber') as string,
            }
        })

        if (result.success === false) {
            setError("не удалось создать аккаунт");
            console.log(result.message)
        } else {
            navigate({ to: '/index' })
        }
    }

    return (
        <div className='page auth--page'>
            <article className='register'>
                <h2>Регистрация</h2>
                <p>{error}</p>
                <form className='form' action="" method="post" onSubmit={handleSubmit}>
                    <input className='input' type='text' name='login' placeholder='Логин' pattern='[a-zA-Z0-9]{6,}' required />
                    <p className="error">Заполните поле, не менее 6 символов</p>

                    <input className='input' type='password' name='password' placeholder='Пароль' minLength={8} required />
                    <p className='error'>Заполните поле, не менее 8 символов</p>

                    <input className='input' type='text' name='fullname' placeholder='ФИО' pattern='[а-яА-Я ]{3,}' required />
                    <p className='error'>Заполните поле используя символы кириллицы</p>

                    <input className='input' type='email' name="email" placeholder='email' required />
                    <p className='error'>Введите свою почту</p>

                    <input className='input' type='text' name="phoneNumber" placeholder='Номер телефона' pattern='8\(\d{3}\)\d{3}-\d{2}-\d{2}' required />
                    <p className='error'>Введите свой номер телефона</p>

                    <button className='button-submit' type='submit'> Создать пользователя </button>
                </form>
            </article>
        </div>
    )
}