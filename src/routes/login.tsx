import type { SubmitEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { TextInput, Button } from '@mantine/core'

import { loginFn } from '../lib/login'


export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault()
    event.stopPropagation()
  
    const form = new FormData(event.target)
    
    const login = form.get('login')!.toString()
    const password = form.get('password')!.toString()

    await loginFn({ data: { login, password }})
  }

  return (
      <div className="min-h-screen">
        <div className="relative py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-center text-5xl md:text-6xl font-bold text-cream mb-4">
              Вход в <span className="text-gold italic">аккаунт</span>{' '}
            </h1>

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

              <Button type="submit" fullWidth>Войти</Button>
            </form>
          </div>
        </div>
      </div>
  )
}
