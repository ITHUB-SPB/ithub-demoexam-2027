import { type SubmitEvent, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { login } from '#/lib/login'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  async function handleSubmit(event: SubmitEvent) {
    const formData = new FormData(event.target)

    const result = await login({
      data: {
        login: formData.get('login') as string,
        password: formData.get('password') as string,
      }
    })

    if (result.success === false) {
      setError(result.message)
      return
    }

    // await navigate({ to: '/' })
  }

  const navigate = Route.useNavigate()
  const [error, setError] = useState<null | string>(null)

  return (
    <div className='page'>
      <h2>Авторизация</h2>
      <p>{error}</p>

      <form className="form" action="" method="post" onSubmit={handleSubmit}>
        <input className="input" type="text" name="login" placeholder='Логин' required />
        <p className="error">Заполните поле</p>

        <input className="input" type="password" name="password" placeholder='Пароль' required />
        <p className="error">Заполните поле</p>

        <button className="button-submit" type="submit">Отправить</button>
      </form>
    </div>
  )
}
