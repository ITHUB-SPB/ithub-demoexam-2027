import type { SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TextInput, Button } from '@mantine/core'

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
        <div className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-cream mb-4">
              Регистрация <span className="text-gold italic">аккаунта</span>{' '}
            </h1>

            <form action="" method="post" onSubmit={handleSubmit}>
              <TextInput 
                label="Логин" 
                description="Латиница и цифры, 6+ символов" 
                placeholder='testuser1' 
              />

              <TextInput 
                label="Пароль" 
                description="Минимум 8 символов" 
                placeholder='********' 
              />

              <TextInput 
                label="Логин" 
                description="Латиница и цифры, 6+ символов" 
                placeholder='testuser1' 
              />

              <TextInput 
                label="ФИО" 
                description="Символы кириллицы и пробелы" 
                placeholder='Иванов Петр Ильич' 
              />

              <TextInput 
                label="Телефон" 
                description="Формат 8(ХХХ)ХХХ-ХХ-ХХ" 
                placeholder='8(999)000-22-11' 
              />

              <TextInput
                label="Почта" 
                description="Действительная почта" 
                placeholder='testuser1@example.com' 
              />

              <Button type="submit" fullWidth>Отправить</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
