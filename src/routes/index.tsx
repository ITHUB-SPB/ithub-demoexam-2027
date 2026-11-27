import { type SubmitEvent, useState } from 'react'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { getSessionUser } from '#/lib/auth'
import { addReview, getMyEntries } from '#/lib/entries'
import { STATUS_DONE } from '#/lib/constants'
import { Header } from '#/components/Header'
import { Slider } from '#/components/Slider'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await getSessionUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    if (user.isAdmin) {
      throw redirect({ to: '/admin' })
    }
  },
  loader: async () => {
    const [user, entries] = await Promise.all([getSessionUser(), getMyEntries()])
    return { user: user!, entries }
  },
  component: EntriesPage,
})

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString('ru-RU')
}

function statusClass(status: string) {
  if (status === 'Идет обучение') return 'status-badge status-progress'
  if (status === 'Обучение завершено') return 'status-badge status-done'
  return 'status-badge status-new'
}

function EntriesPage() {
  const { user, entries } = Route.useLoaderData()

  return (
    <div className="page">
      <Header fullname={user.fullname} isAdmin={user.isAdmin} />

      <Slider />

      <section>
        <div className="section-head">
          <h2>Мои заявки</h2>
          <Link to="/new-entry" className="button-link">
            Оставить заявку
          </Link>
        </div>

        {entries.length === 0 ? (
          <p className="empty">
            У вас пока нет заявок.{' '}
            <Link to="/new-entry">Оставить первую заявку</Link>
          </p>
        ) : (
          <ul className="entries">
            {entries.map((entry) => (
              <li key={entry.id} className="entry-card">
                <div className="entry-head">
                  <h3 className="entry-course">{entry.course}</h3>
                  <span className={statusClass(entry.status)}>
                    {entry.status}
                  </span>
                </div>
                <div className="entry-meta">
                  <span>Начало обучения: {formatDate(entry.startAt)}</span>
                  <span>Оплата: {entry.paymentType}</span>
                  <span>Подана: {formatDate(entry.createdAt)}</span>
                </div>
                {entry.review ? (
                  <p className="review">
                    <strong>Ваш отзыв:</strong> {entry.review}
                  </p>
                ) : (
                  entry.status === STATUS_DONE && <ReviewForm entryId={entry.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function ReviewForm({ entryId }: { entryId: number }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await addReview({
      data: { entryId, review: String(formData.get('review') ?? '') },
    })

    setPending(false)
    if (!result.success) {
      setError(result.message)
      return
    }

    await router.invalidate()
  }

  return (
    <form className="form review-form" onSubmit={handleSubmit}>
      <textarea
        className="input"
        name="review"
        placeholder="Ваш отзыв о качестве образовательных услуг"
        minLength={3}
        required
      />
      <p className="error">Введите текст отзыва</p>
      {error && <p className="error error-visible">{error}</p>}
      <button className="button-submit" type="submit" disabled={pending}>
        Оставить отзыв
      </button>
    </form>
  )
}
