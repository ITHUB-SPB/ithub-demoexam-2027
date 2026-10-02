import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { listAllApplicationsFn, updateStatusFn } from '#/lib/admin'

export const Route = createFileRoute('/admin')({
  loader: async () => listAllApplicationsFn({ data: { page: 1, perPage: 5 } }),
  component: AdminPage,
})

const STATUSES = ['Новая', 'Идет обучение', 'Обучение завершено']

function AdminPage() {
  const initial = Route.useLoaderData()
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState(initial)

  async function reload(nextPage = page, nextStatus = statusFilter) {
    const res = await listAllApplicationsFn({
      data: {
        page: nextPage,
        perPage: 5,
        status: nextStatus || undefined,
      },
    })
    setData(res)
    setPage(nextPage)
  }

  async function changeStatus(id: number, status: string) {
    await updateStatusFn({ data: { id, status } })
    await reload()
    await router.invalidate()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Панель администратора</h2>

      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            reload(1, e.target.value)
          }}
          className="rounded border border-slate-300 px-3 py-2"
        >
          <option value="">Все статусы</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => reload()}
          className="rounded bg-slate-700 px-3 py-2 text-white"
        >
          Обновить
        </button>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Пользователь</th>
            <th className="p-2">Курс</th>
            <th className="p-2">Дата начала</th>
            <th className="p-2">Оплата</th>
            <th className="p-2">Статус</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((a) => (
            <tr key={a.id} className="border-b border-slate-200">
              <td className="p-2">{a.id}</td>
              <td className="p-2">
                {a.user.fio} ({a.user.login})
              </td>
              <td className="p-2">{a.course.name}</td>
              <td className="p-2">{a.startDate}</td>
              <td className="p-2">{a.paymentMethod}</td>
              <td className="p-2">
                <select
                  value={a.status}
                  onChange={(e) => changeStatus(a.id, e.target.value)}
                  className="rounded border border-slate-300 px-2 py-1"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {data.items.length === 0 && (
            <tr>
              <td colSpan={6} className="p-3 text-center text-slate-500">
                Заявок нет
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex items-center gap-2">
        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => reload(p)}
            className={`rounded px-3 py-1 ${
              p === data.page
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}