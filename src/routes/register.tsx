import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

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

  // Функция валидации
  const validate = () => {
    const errs: Record<string, string> = {}
    
    if (!/^[A-Za-z0-9]{6,}$/.test(form.login)) 
      errs.login = 'Латиница и цифры, минимум 6 символов'
    
    if (form.password.length < 8) 
      errs.password = 'Минимум 8 символов'
    
    if (!/^[А-Яа-яЁё\s]+$/.test(form.fullName)) 
      errs.fullName = 'Только кириллица и пробелы'
    
    if (!/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(form.phone)) 
      errs.phone = 'Формат: 8(XXX)XXX-XX-XX'
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) 
      errs.email = 'Некорректный email'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      // Временно просто перекидываем на логин
      alert('Регистрация успешна! (База данных подключится позже)')
      navigate({ to: '/login' })
    }
  }

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Логин</label>
          <input 
            type="text" 
            className={`form-control ${errors.login ? 'is-invalid' : ''}`}
            placeholder="Например: user123"
            value={form.login}
            onChange={(e) => setForm({...form, login: e.target.value})}
          />
          {errors.login && <span className="error-text">{errors.login}</span>}
        </div>

        <div className="form-group">
          <label>Пароль</label>
          <input 
            type="password" 
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder="Минимум 8 символов"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>ФИО</label>
          <input 
            type="text" 
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="Иванов Иван Иванович"
            value={form.fullName}
            onChange={(e) => setForm({...form, fullName: e.target.value})}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Телефон</label>
          <input 
            type="text" 
            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
            placeholder="8(999)123-45-67"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            placeholder="example@mail.ru"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <button type="submit" className="btn">Зарегистрироваться</button>
      </form>

      <Link to="/login" className="link-text">Уже зарегистрированы? Войти</Link>
    </div>
  )
}