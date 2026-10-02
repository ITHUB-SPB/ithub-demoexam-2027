import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { loginUser } from '../server/login'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setError('')

    // Проверка, что поля не пустые
    const newErrors: Record<string, string> = {}
    if (!form.login) newErrors.login = 'Введите логин'
    if (!form.password) newErrors.password = 'Введите пароль'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const res = await loginUser({ data: form })

    if (!res.success) {
      setError(res.error)
      return
    }
    localStorage.setItem('user', JSON.stringify(res.user))
    navigate({ to: '/applications' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Вход</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Войти
        </button>

        <Link
          to="/register"
          className="block text-center text-sm text-blue-600 hover:underline"
        >
          Еще не зарегистрированы? Регистрация
        </Link>
      </form>
    </div>
  )
}
<Link
  to="/admin-login"
  className="block text-center text-xs text-gray-500 hover:underline mt-2"
>
  Вход для администратора
</Link>