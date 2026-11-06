import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})

const MOCK_ALL_APPLICATIONS = [
  { id: 1, user: 'ivanov', course: 'Основы веб-дизайна', date: '01.09.2026', payment: 'Наличными', status: 'completed' },
  { id: 2, user: 'petrov', course: 'Основы алгоритмизации', date: '15.10.2026', payment: 'Переводом', status: 'in_progress' },
  { id: 3, user: 'sidorov', course: 'Основы проектирования БД', date: '01.12.2026', payment: 'Наличными', status: 'new' },
  { id: 4, user: 'smirnova', course: 'Основы веб-дизайна', date: '10.11.2026', payment: 'Переводом', status: 'new' },
]

const ITEMS_PER_PAGE = 3

function AdminPanel() {
  const [applications, setApplications] = useState(MOCK_ALL_APPLICATIONS)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCourse, setFilterCourse] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState('')

  // Фильтрация
  const filteredApps = applications.filter(app => {
    const matchStatus = filterStatus === 'all' || app.status === filterStatus
    const matchCourse = filterCourse === 'all' || app.course.includes(filterCourse)
    return matchStatus && matchCourse
  })

  // Пагинация
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentApps = filteredApps.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleStatusChange = (id: number, newStatus: string) => {
    setApplications(apps => 
      apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
    )
    showToast('Статус заявки обновлен!')
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const getStatusLabel = (status: string) => {
    if (status === 'new') return 'Новая'
    if (status === 'in_progress') return 'Идет обучение'
    if (status === 'completed') return 'Обучение завершено'
    return status
  }

  return (
    <div>
      <h1>Панель администратора</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <select 
          className="form-control" 
          value={filterStatus} 
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">Все статусы</option>
          <option value="new">Новая</option>
          <option value="in_progress">Идет обучение</option>
          <option value="completed">Обучение завершено</option>
        </select>

        <select 
          className="form-control" 
          value={filterCourse} 
          onChange={(e) => { setFilterCourse(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">Все курсы</option>
          <option value="веб-дизайна">Веб-дизайн</option>
          <option value="алгоритмизации">Алгоритмизация</option>
          <option value="проектирования БД">Проектирование БД</option>
        </select>
      </div>

      {/* Таблица */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Юзер</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Курс</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {currentApps.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Нет заявок</td>
              </tr>
            ) : (
              currentApps.map(app => (
                <tr key={app.id}>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.id}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.user}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.course}</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      style={{ padding: '4px', fontSize: '12px', borderRadius: '4px' }}
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">Идет обучение</option>
                      <option value="completed">Обучение завершено</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
          <button 
            className="btn" 
            style={{ width: 'auto', padding: '6px 12px' }} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            &laquo; Назад
          </button>
          <span style={{ alignSelf: 'center', fontSize: '14px' }}>Стр. {currentPage} из {totalPages}</span>
          <button 
            className="btn" 
            style={{ width: 'auto', padding: '6px 12px' }} 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Вперед &raquo;
          </button>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, fontSize: '14px'
        }}>
          {toast}
        </div>
      )}

      <Link to="/" className="link-text" style={{ marginTop: '20px' }}>На главную</Link>
    </div>
  )
}