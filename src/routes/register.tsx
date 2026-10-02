import { type FormEvent, type SubmitEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { register } from "#/lib/register";

export const Route = createFileRoute('/register')({
    component: RouteComponent
})

function RouteComponent(event: FormEvent<HTMLFormElement>) {
    async function handleSubmit(event:SubmitEvent) {
        const formData = new FormData(event.target)
        event.preventDefault()

        const result = await register ({
            data: {
                email: formData.get('email') as string,
                login: formData.get('login') as string,
                password: formData.get('password') as string,
                fullname: formData.get('fullname') as string,
                phone: formData.get('phone') as string
            }
        })

        if (result.success === false) {
            setError('Не удалось создать аккаунт')
            return
        }

        await navigate({ to: '/login'})
    }

    const navigate = Route.useNavigate()
    const [error, setError] = useState<null | string>(null)

    return (
        <div className="page page--auth">

            <article>
                <h2>Регистрация</h2>
                <p>{error}</p>

                <form className="form" action="" method="post" onSubmit={handleSubmit}>
                    <input className="input" type="text" name="login" placeholder='Логин' pattern='[a-zA-Z0-9]{6,}' required />
                    <p className="error">Заполните поле (латиница и цифры, не менее 6 символов)</p>

                    <input className="input" type="password" name="password" minLength={8} placeholder='Пароль' required />
                    <p className="error">Заполните поле (не менее 8 символов)</p>

                    <input className="input" type="text" name="fullname" placeholder='ФИО' pattern='[а-яА-Я ]{3,}' required />
                    <p className="error">Заполните поле (символы кириллицы и пробелы)</p>

                    <input className="input" type="email" name="email" placeholder='Почта' required />
                    <p className="error">Заполните поле (формат электронной почты)</p>

                    <input className="input" type="tel" name="phone" placeholder='Телефон' pattern='8\(\d{3}\)\d{3}-\d{2}-\d{2}' required />
                    <p className="error">Заполните поле (формат 8(ххх)ххх-хх-хх)</p>

                    <button className="button-submit" type="submit">Создать пользователя</button>
                </form>

                <Link to="/login">Уже зарегистрированы? Войти</Link>
            </article>
        </div>
    )
}