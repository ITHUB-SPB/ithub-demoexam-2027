// src/routes/register.tsx
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import { register } from '../lib/auth.functions'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

// Клиентская схема валидации — та же, что и на сервере
const formSchema = z.object({
  login: z
    .string()
    .min(6, 'Логин должен быть не менее 6 символов')
    .regex(/^[a-zA-Z0-9]+$/, 'Логин может содержать только латиницу и цифры'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
  fullName: z
    .string()
    .regex(/^[А-Яа-яЁё\s]+$/, 'ФИО может содержать только символы кириллицы и пробелы'),
  phone: z
    .string()
    .regex(/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, 'Телефон должен быть в формате 8(XXX)XXX-XX-XX'),
  email: z.string().email('Некорректный email'),
})

type FormData = z.infer<typeof formSchema>

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    login: '',
    password: '',
    fullName: '',
    phone: '',
    email: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | 'form', string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // Убираем ошибку у поля при редактировании
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, form: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // 1. Клиентская валидация
    const parsed = formSchema.safeParse(formData)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    // 2. Отправка на сервер
    setIsSubmitting(true)
    try {
      const result = await register({ data: parsed.data })

      if (!result.success) {
        setErrors({ ...result.fieldErrors, form: result.formError })
        return
      }

      // Успех — переходим на логин
      navigate({ to: '/login' })
    } catch (err) {
      // На случай, если сервер всё-таки выбросил ошибку Zod
      setErrors({ form: 'Ошибка отправки формы' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Регистрация</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field
          label="Логин"
          name="login"
          value={formData.login}
          onChange={handleChange}
          placeholder="Латиница и цифры, от 6 символов"
          error={errors.login}
        />
        <Field
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Минимум 8 символов"
          error={errors.password}
        />
        <Field
          label="ФИО"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Иванов Иван Иванович"
          error={errors.fullName}
        />
        <Field
          label="Телефон"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="8(999)123-45-67"
          error={errors.phone}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="example@mail.ru"
          error={errors.email}
        />

        {errors.form && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/login" className="text-blue-500 hover:underline">
          Уже зарегистрированы? Войти
        </Link>
      </div>
    </div>
  )
}

// Переиспользуемый компонент поля с подписью ошибки
function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
}: {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border p-2 rounded ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}