import { type SubmitEvent, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { TextInput, Button } from '@mantine/core'

import HeroCarousel from '#/components/HeroCarousel'
import { registerFn } from '../lib/register'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const form = new FormData(event.target)

    const login = form.get('login')!.toString()
    const password = form.get('password')!.toString()
    const email = form.get('email')!.toString()
    const phone = form.get('phone')!.toString()
    const fullname = form.get('fullname')!.toString()

    const result = await registerFn({ data: { login, password, email, phone, fullname } })

    if ('success' in result) {
      await navigate({ to: '/login' })
    } else {
      setError(result.error)
    }
  }

  return (
    <>
      <div className="min-h-screen">
        <div className="relative flex flex-row min-h-screen">
          <HeroCarousel />

          <div className="mx-auto py-12 px-8 grow-1">
            <h1 className="font-display text-3xl font-bold text-center mb-6">
              Учебный центр
              <span className="block text-gold italic">KOROCHEK.NET</span>
            </h1>

            <h2 className="font-display text-center text-5xl md:text-6xl font-bold text-cream mb-4">
              Регистрация
            </h2>

            <p className='text-red-700 text-md text-center'>
              {error}
            </p>

            <form className='max-w-xl mx-auto' action="" method="post" onSubmit={handleSubmit}>
              <TextInput
                label="Логин"
                description="Латиница и цифры, 6+ символов"
                placeholder='testuser1'
                required
                pattern='[a-zA-Z0-9]{6,}'
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

              <TextInput
                label="ФИО"
                description="Символы кириллицы и пробелы"
                placeholder='Иванов Петр Ильич'
                required
                name="fullname"
                pattern="[а-яА-Я]+ [а-яА-Я]+ [а-яА-Я]+"
              />

              <TextInput
                label="Телефон"
                description="Формат 8(ХХХ)ХХХ-ХХ-ХХ"
                placeholder='8(999)000-22-11'
                required
                name="phone"
                pattern="8\(\d{3}\)\d{3}-\d{2}-\d{2}"
              />

              <TextInput
                label="Почта"
                description="Действительная почта"
                placeholder='testuser1@example.com'
                required
                name="email"
                type="email"
              />

              <Button type="submit" fullWidth>Отправить</Button>
            </form>

            <Link to="/login" className='mx-auto'>Уже зарегистрированы? Войдите в аккаунт!</Link>
          </div>
        </div>
      </div>
    </>
  )
}
