import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/create')({
  component: CreateApplicationPage,
})

function CreateApplicationPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    course: '',
    date: '',
    payment: 'cash', // cash | transfer
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.course) errs.course = 'Выберите курс'
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(form.date)) errs.date = 'Формат: ДД.ММ.ГГГГ'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      alert('Заявка отправлена! (База данных подключится позже)')
      navigate({ to: '/applications' })
    }
  }

  return (
    <div>
      <h1>Новая заявка</h1>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Наименование курса</label>
          <select 
            className={`form-control ${errors.course ? 'is-invalid' : ''}`}
            value={form.course}
            onChange={(e) => setForm({...form, course: e.target.value})}
          >
            <option value="">Выберите курс...</option>
            <option value="1">Основы алгоритмизации и программирования</option>
            <option value="2">Основы веб-дизайна</option>
            <option value="3">Основы проектирования баз данных</option>
          </select>
          {errors.course && <span className="error-text">{errors.course}</span>}
        </div>

        <div className="form-group">
          <label>Желаемая дата начала обучения</label>
          <input 
            type="text" 
            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            placeholder="ДД.ММ.ГГГГ"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label>Способ оплаты</label>
          <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
              <input 
                type="radio" 
                name="payment" 
                value="cash" 
                checked={form.payment === 'cash'} 
                onChange={() => setForm({...form, payment: 'cash'})}
              />
              Наличными
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'normal' }}>
              <input 
                type="radio" 
                name="payment" 
                value="transfer" 
                checked={form.payment === 'transfer'} 
                onChange={() => setForm({...form, payment: 'transfer'})}
              />
              Переводом
            </label>
          </div>
        </div>

        <button type="submit" className="btn">Отправить заявку</button>
      </form>

      <Link to="/applications" className="link-text">Вернуться к моим заявкам</Link>
    </div>
  )
}