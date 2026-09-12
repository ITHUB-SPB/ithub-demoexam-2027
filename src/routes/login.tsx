import { type SubmitEvent, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { LoginForm } from '#/components/login-form'
import { loginFn } from '../lib/login'


export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const form = new FormData(event.target)

    const login = form.get('login')!.toString()
    const password = form.get('password')!.toString()

    const result = await loginFn({ data: { login, password } })

    if (result.error) {
      setError(result.error)
    } else {
      navigate({ to: '/profile' })
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className='text-red-700 text-md text-center'>
            {error}
          </p>

          <LoginForm onSubmit={handleSubmit} />

          {/* <form className='max-w-xl mx-auto' action="" method="post" onSubmit={handleSubmit}>
            <TextInput
              label="Логин"
              description="Латиница и цифры, 6+ символов"
              placeholder='testuser1'
              required
              pattern='[a-zA-Z0-9]{5,}'
              name="login"
            />

            <TextInput
              label="Пароль"
              description="Минимум 8 символов"
              placeholder='********'
              required
              minLength={8}
              name="password"
              type='password'
            />

            <Button type="submit" fullWidth>Войти</Button>
          </form> */}

          {/* <Link to="/register">Нет аккаунта? Зарегистрируйтесь!</Link> */}
        </div>
      </div>
    </div>
  )
}
