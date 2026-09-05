import type { SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { registerFn } from '../lib/register'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {


  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    event.stopPropagation()
  
    const form = new FormData(event.target)
    const login = form.get('login')!.toString()
    const password = form.get('password')!.toString()

    await registerFn({ data: { login, password }})
  }

  return (
    <>
      <div className="min-h-screen">
        {/* Hero section */}
        <div className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-cream mb-4">
              Регистрация <span className="text-gold italic">аккаунта</span>{' '}
            </h1>

            <form action="" method="post" onSubmit={handleSubmit}>
              <section>
                <label htmlFor="login">Логин</label>
                <input type="text" name="login" id="login" required />
              </section>

              <section>
                <label htmlFor="password">Пароль</label>
                <input type="password" name="password" id="password" required />
              </section>

              <button type="submit">Отправить</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
