// src/routes/login.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { login } from '../lib/auth.functions'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ login: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors((prev) => ({ ...prev, [e.target.name]: '', form: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!formData.login) {
      setErrors({ login: 'Введите логин' })
      return
    }
    if (!formData.password) {
      setErrors({ password: 'Введите пароль' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login({ data: formData })

      if (!result.success) {
        setErrors({ ...result.fieldErrors, form: result.formError ?? '' })
        return
      }

      // Сохраняем сессию в localStorage (для демо — простой вариант)
      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: result.userId,
          fullName: result.fullName,
          role: result.role,
        })
      )

      // Редирект: админ — в админку, юзер — на заявки
      if (result.role === 'ADMIN') {
        navigate({ to: '/admin' })
      } else {
        navigate({ to: '/applications' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Вход</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block mb-1 text-sm font-medium">Логин</label>
          <input
            name="login"
            value={formData.login}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.login ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Пароль</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full border p-2 rounded ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {errors.form && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/register" className="text-blue-500 hover:underline">
          Еще не зарегистрированы? Регистрация
        </Link>
      </div>
    </div>
  )
}