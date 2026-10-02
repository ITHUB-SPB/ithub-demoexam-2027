import { type SubmitEvent, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { login } from '#/lib/login'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  async function handleSubmit(event: SubmitEvent) {
    const formData = new FormData(event.target)

    const result = await login({
      data: {
        login: formData.get('login')?.toString() as string,
        password: formData.get('password')?.toString() as string,
      }
    })
    if (!result.success) {
      setError(result.message)
      return
    }
    await navigate({ to: "/" })
  }

  const navigate = Route.useNavigate()
  const [error, setError] = useState<null | string>(null)

  return (
    <div className='page'>
      <article>
        <h2>Авторизация</h2>
        <p>{error}</p>

        <form className='form' action="" method='post' onSubmit={handleSubmit}>
          <input type="text" className='input' name='login' placeholder='Логин' required />
          <p className='error'>Заполните поле</p>

          <input type="password" className='input' name='password' placeholder='Пароль' required />
          <p className='error'>Заполните поле</p>

          <button className='button-submit' type='submit'>Отправить</button>
        </form>

        <Link to="/register">Ещё не зарегистрированы? Регистрация</Link>
      </article>
    </div>
  )
}
