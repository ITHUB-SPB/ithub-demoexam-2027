import { useEffect, useRef, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionUser } from '#/lib/auth'
import { getAdminEntries, setEntryStatus } from '#/lib/admin'
import { ENTRY_STATUSES } from '#/lib/constants'
import { Header } from '#/components/Header'

type AdminEntry = {
  id: number
  course: string
  paymentType: string
  startAt: Date | string
  status: string
  review: string | null
  createdAt: Date | string
  user: { login: string; fullname: string; phone: string; email: string }
}

type AdminData = {
  entries: AdminEntry[]
  total: number
  page: number
  pageCount: number
}

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getSessionUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    if (!user.isAdmin) {
      throw redirect({ to: '/' })
    }
  },
  loader: async () => {
    const [user, initial] = await Promise.all([
      getSessionUser(),
      getAdminEntries({ data: { page: 1 } }),
    ])
    return { user: user!, initial }
  },
  component: AdminPage,
})

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString('ru-RU')
}

function AdminPage() {
  const { user, initial } = Route.useLoaderData()

  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<AdminData>(
    initial.success
      ? {
          entries: initial.entries,
          total: initial.total,
          page: initial.page,
          pageCount: initial.pageCount,
        }
      : { entries: [], total: 0, page: 1, pageCount: 1 },
  )
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)

  async function refresh(nextPage = page, nextStatus = statusFilter) {
    const result = await getAdminEntries({
      data: { page: nextPage, status: nextStatus || undefined },
    })
    if (result.success) {
      setData(result)
    }
  }

  useEffect(() => {
    void refresh(page, statusFilter)
  }, [page, statusFilter])

  function showToast(message: string) {
    setToast(message)
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current)
    }
    toastTimer.current = window.setTimeout(() => setToast(null), 3000)
  }

  async function handleStatusChange(entryId: number, status: string) {
    const result = await setEntryStatus({ data: { entryId, status } })
    showToast(result.message)
    if (result.success) {
      await refresh()
    }
  }

  return (
    <div className="page">
      <Header fullname={user.fullname} isAdmin={user.isAdmin} />

      <section>
        <div className="section-head">
          <h2>Панель администратора</h2>
          <select
            className="input filter-select"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Фильтр по статусу"
          >
            <option value="">Все статусы</option>
            {ENTRY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Пользователь</th>
                <th>Контакты</th>
                <th>Курс</th>
                <th>Дата начала</th>
                <th>Оплата</th>
                <th>Отзыв</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty">
                    Заявки не найдены
                  </td>
                </tr>
              ) : (
                data.entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.id}</td>
                    <td>
                      <strong>{entry.user.fullname}</strong>
                      <br />
                      <span className="muted">{entry.user.login}</span>
                    </td>
                    <td>
                      {entry.user.phone}
                      <br />
                      <span className="muted">{entry.user.email}</span>
                    </td>
                    <td>{entry.course}</td>
                    <td>{formatDate(entry.startAt)}</td>
                    <td>{entry.paymentType}</td>
                    <td className="review-cell">{entry.review ?? '—'}</td>
                    <td>
                      <select
                        className="input status-select"
                        value={entry.status}
                        onChange={(event) =>
                          void handleStatusChange(entry.id, event.target.value)
                        }
                        aria-label={`Статус заявки №${entry.id}`}
                      >
                        {ENTRY_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            type="button"
            disabled={data.page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            ← Назад
          </button>
          <span className="pagination-info">
            Страница {data.page} из {data.pageCount} (всего заявок: {data.total})
          </span>
          <button
            type="button"
            disabled={data.page >= data.pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Вперед →
          </button>
        </div>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
