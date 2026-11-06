import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/application')({
  component: ApplicationsPage,
})

// Временные данные для примера
const MOCK_APPLICATIONS = [
  { id: 1, course: 'Основы веб-дизайна', date: '01.09.2026', payment: 'Наличными', status: 'completed' },
  { id: 2, course: 'Основы алгоритмизации и программирования', date: '15.10.2026', payment: 'Переводом', status: 'in_progress' },
  { id: 3, course: 'Основы проектирования баз данных', date: '01.12.2026', payment: 'Наличными', status: 'new' },
]

function ApplicationsPage() {
  const [reviewText, setReviewText] = useState('')
  const [showReviewForm, setShowReviewForm] = useState<number | null>(null)

  const getStatusLabel = (status: string) => {
    if (status === 'new') return 'Новая'
    if (status === 'in_progress') return 'Идет обучение'
    if (status === 'completed') return 'Обучение завершено'
    return status
  }

  const getStatusColor = (status: string) => {
    if (status === 'new') return '#0056b3'
    if (status === 'in_progress') return '#f0ad4e'
    if (status === 'completed') return '#28a745'
    return '#333'
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Отзыв сохранен! (База данных подключится позже)')
    setShowReviewForm(null)
    setReviewText('')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h1 style={{ margin: 0 }}>Мои заявки</h1>
        <Link to="/create" className="btn" style={{ width: 'auto', padding: '8px 12px', fontSize: '14px' }}>+ Новая</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {MOCK_APPLICATIONS.map((app) => (
          <div key={app.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', background: '#fafafa' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{app.course}</h3>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Дата начала: {app.date}</p>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#555' }}>Оплата: {app.payment}</p>
            
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: getStatusColor(app.status), fontSize: '14px' }}>
                Статус: {getStatusLabel(app.status)}
              </span>
              
              {app.status === 'completed' && showReviewForm !== app.id && (
                <button 
                  className="btn" 
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', marginTop: 0 }}
                  onClick={() => setShowReviewForm(app.id)}
                >
                  Оставить отзыв
                </button>
              )}
              
              {app.status !== 'completed' && (
                <button 
                  className="btn" 
                  style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', marginTop: 0, background: '#ccc', cursor: 'not-allowed' }}
                  disabled
                  title="Отзыв доступен только после завершения обучения"
                >
                  Оставить отзыв
                </button>
              )}
            </div>

            {/* Форма отзыва */}
            {showReviewForm === app.id && (
              <form onSubmit={handleReviewSubmit} style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                <div className="form-group">
                  <label>Ваш отзыв</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    placeholder="Напишите, что вам понравилось..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn" style={{ padding: '8px', fontSize: '14px' }}>Отправить</button>
                  <button type="button" className="btn" style={{ padding: '8px', fontSize: '14px', background: '#6c757d' }} onClick={() => setShowReviewForm(null)}>Отмена</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      <Link to="/" className="link-text" style={{ marginTop: '30px' }}>На главную</Link>
    </div>
  )
}