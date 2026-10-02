import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getUserApplications, createReview } from '../server/applications'

export const Route = createFileRoute('/applications')({
  component: ApplicationsPage,
})

type Application = {
  id: number
  courseName: string
  startDate: string
  paymentMethod: string
  status: string
  review: { id: number; text: string } | null
}

function ApplicationsPage() {
  const navigate = useNavigate()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewText, setReviewText] = useState<Record<number, string>>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userJson = localStorage.getItem('user')
    if (!userJson) {
      navigate({ to: '/login' })
      return
    }
    const user = JSON.parse(userJson)

    getUserApplications({ data: { userId: user.id } }).then((res) => {
      if (res.success) setApps(res.applications as Application[])
      setLoading(false)
    })
  }, [])

  const handleReview = async (appId: number) => {
    setMessage('')
    const text = reviewText[appId]?.trim()
    if (!text) return

    const res = await createReview({ data: { applicationId: appId, text } })

    if (!res.success) {
      setMessage(res.error)
      return
    }

    setMessage('Отзыв успешно добавлен!')
    const user = JSON.parse(localStorage.getItem('user')!)
    const updated = await getUserApplications({ data: { userId: user.id } })
    if (updated.success) setApps(updated.applications as Application[])
  }

  const logout = () => {
    localStorage.removeItem('user')
    navigate({ to: '/login' })
  }

  if (loading) return <div className="p-8">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои заявки</h1>
          <button
            onClick={logout}
            className="text-sm text-blue-600 hover:underline"
          >
            Выйти
          </button>
        </div>

        {message && (
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg text-sm mb-4">
            {message}
          </div>
        )}

        {apps.length === 0 && (
          <p className="text-gray-500">У вас пока нет заявок.</p>
        )}

        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow p-4">
              <div className="flex justify-between">
                <h2 className="font-semibold">{app.courseName}</h2>
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
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Дата начала: {app.startDate}
              </p>
              <p className="text-sm text-gray-600">
                Оплата: {app.paymentMethod}
              </p>
              {app.review ? (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
                  <span className="font-medium">Ваш отзыв:</span>{' '}
                  {app.review.text}
                </div>
              ) : app.status === 'Обучение завершено' ? (
                <div className="mt-3">
                  <textarea
                    value={reviewText[app.id] || ''}
                    onChange={(e) =>
                      setReviewText({ ...reviewText, [app.id]: e.target.value })
                    }
                    placeholder="Оставьте отзыв о курсе..."
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    rows={3}
                  />
                  <button
                    onClick={() => handleReview(app.id)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  >
                    Оставить отзыв
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-gray-400">
                  Отзыв можно оставить после завершения обучения.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
