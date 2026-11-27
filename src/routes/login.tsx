import { type SubmitEvent, useState } from 'react'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { login } from '#/lib/login'
import { getSessionUser } from '#/lib/auth'

export const Route = createFileRoute('/login')({
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
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await login({
      data: {
        login: String(formData.get('login') ?? ''),
        password: String(formData.get('password') ?? ''),
      },
    })

    setPending(false)
    if (!result.success) {
      setError(result.message)
      return
    }

    await router.invalidate()
    await navigate({ to: result.isAdmin ? '/admin' : '/' })
  }

  return (
    <div className="page page-auth">
      <section className="auth-card">
        <h2>Авторизация</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            name="login"
            placeholder="Логин"
            required
          />
          <p className="error">Заполните поле</p>

          <input
            className="input"
            type="password"
            name="password"
            placeholder="Пароль"
            required
          />
          <p className="error">Заполните поле</p>

          {error && <p className="error error-visible">{error}</p>}

          <button className="button-submit" type="submit" disabled={pending}>
            Войти
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/register">Еще не зарегистрированы? Регистрация</Link>
        </p>
      </section>
    </div>
  )
}
