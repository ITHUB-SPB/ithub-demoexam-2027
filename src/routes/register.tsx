import { type SubmitEvent, useState } from 'react'
import { Link, createFileRoute, redirect } from '@tanstack/react-router'
import { register } from '#/lib/register'
import { getSessionUser } from '#/lib/auth'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const user = await getSessionUser()
    if (user) {
      throw redirect({ to: user.isAdmin ? '/admin' : '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await register({
      data: {
        login: String(formData.get('login') ?? ''),
        password: String(formData.get('password') ?? ''),
        fullname: String(formData.get('fullname') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        email: String(formData.get('email') ?? ''),
      },
    })

    setPending(false)
    if (!result.success) {
      setError(result.message)
      return
    }

    await navigate({ to: '/login' })
  }

  return (
    <div className="page page-auth">
      <section className="auth-card">
        <h2>Регистрация</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="login"
            placeholder="Логин"
            pattern="[a-zA-Z0-9]{6,}"
            required
          />
          <p className="error">Заполните поле (латиница и цифры, не менее 6 символов)</p>

          <input
            className="input"
            type="password"
            name="password"
            minLength={8}
            placeholder="Пароль"
            required
          />
          <p className="error">Заполните поле (не менее 8 символов)</p>

          <input
            className="input"
            type="text"
            name="fullname"
            placeholder="ФИО"
            pattern="[а-яА-ЯёЁ\s]+"
            required
          />
          <p className="error">Заполните поле (символы кириллицы и пробелы)</p>

          <input
            className="input"
            type="tel"
            name="phone"
            placeholder="Телефон"
            pattern="8\(\d{3}\)\d{3}-\d{2}-\d{2}"
            required
          />
          <p className="error">Заполните поле (формат 8(XXX)XXX-XX-XX)</p>

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Электронная почта"
            required
          />
          <p className="error">Заполните поле (формат электронной почты)</p>

          {error && <p className="error error-visible">{error}</p>}

          <button className="button-submit" type="submit" disabled={pending}>
            Зарегистрироваться
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">Уже зарегистрированы? Войти</Link>
        </p>
      </section>
    </div>
  )
}
