import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { registerUser } from '../server/register'
import { registerSchema } from '../lib/validation'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setServerError('')

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    const res = await registerUser({ data: form })

    if (!res.success) {
      setServerError(res.error)
      return
    }

    setSuccess(true)
    setTimeout(() => navigate({ to: '/login' }), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Регистрация</h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
            Вы успешно зарегистрированы! Перенаправление на вход...
          </div>
        )}

        {serverError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Логин</label>
          <input
            type="text"
            value={form.login}
            onChange={(e) => handleChange('login', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="user123"
          />
          {errors.login && (
            <p className="text-red-600 text-xs mt-1">{errors.login}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="********"
          />
          {errors.password && (
            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ФИО</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Иванов Иван Иванович"
          />
          {errors.fullName && (
            <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Телефон</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="8(999)123-45-67"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="user@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Зарегистрироваться
        </button>

        <Link
          to="/login"
          className="block text-center text-sm text-blue-600 hover:underline"
        >
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  )
}