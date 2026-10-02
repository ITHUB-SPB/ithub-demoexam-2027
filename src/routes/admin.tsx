import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  getAllApplications,
  updateApplicationStatus,
} from '../server/applications'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

type AppItem = {
  id: number
  courseName: string
  startDate: string
  paymentMethod: string
  status: string
  user: { login: string; fullName: string; phone: string }
}

const STATUSES = ['Новая', 'Идет обучение', 'Обучение завершено']
const PAGE_SIZE = 5

function AdminPage() {
  const navigate = useNavigate()
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [filter, setFilter] = useState<string>('Все')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (localStorage.getItem('admin') !== 'true') {
      navigate({ to: '/admin-login' })
      return
    }
    loadApps()
  }, [])

  const loadApps = async () => {
    const res = await getAllApplications()
    if (res.success) setApps(res.applications as AppItem[])
    setLoading(false)
  }

  const handleStatusChange = async (id: number, status: string) => {
    const res = await updateApplicationStatus({
      data: { applicationId: id, status },
    })

    if (res.success) {
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
      setToast('Статус обновлён')
      setTimeout(() => setToast(''), 2000)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin')
    navigate({ to: '/admin-login' })
  }

  const filtered =
    filter === 'Все' ? apps : apps.filter((a) => a.status === filter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Панель администратора</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Выйти
          </button>
        </div>
        {toast && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
            {toast}
          </div>
        )}

        {/* Фильтр */}
        <div className="mb-4 flex flex-wrap gap-2">
          {['Все', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFilter(s)
                setPage(1)
              }}
              className={
                'px-3 py-1 rounded-lg text-sm border ' +
                (filter === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300')
              }
            >
              {s}
            </button>
          ))}
        </div>

        {paginated.length === 0 && (
          <p className="text-gray-500">Заявок нет.</p>
        )}
        <div className="space-y-3">
          {paginated.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{app.courseName}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Пользователь: <b>{app.user.login}</b> ({app.user.fullName})
                  </p>
                  <p className="text-sm text-gray-600">
                    Телефон: {app.user.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Дата начала: {app.startDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    Оплата: {app.paymentMethod}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={
                      'text-xs px-2 py-1 rounded-full ' +
                      (app.status === 'Новая'
                        ? 'bg-yellow-100 text-yellow-700'
                        : app.status === 'Идет обучение'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700')
                    }
                  >
                    {app.status}
                  </span>

                  <select
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app.id, e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 text-sm bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
            >
              ← Назад
            </button>
            <span className="text-sm">
              Страница {page} из {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-40"
            >
              Вперёд →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}