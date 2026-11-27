import { type SubmitEvent, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionUser } from '#/lib/auth'
import { createEntry } from '#/lib/entries'
import { COURSES, PAYMENT_TYPES } from '#/lib/constants'
import { Header } from '#/components/Header'

export const Route = createFileRoute('/new-entry')({
  beforeLoad: async () => {
    const user = await getSessionUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    if (user.isAdmin) {
      throw redirect({ to: '/admin' })
    }
  },
  loader: async () => ({ user: (await getSessionUser())! }),
  component: NewEntryPage,
})

function NewEntryPage() {
  const { user } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const result = await createEntry({
      data: {
        course: String(formData.get('course') ?? ''),
        startDate: String(formData.get('startDate') ?? ''),
        paymentType: String(formData.get('paymentType') ?? ''),
      },
    })

    setPending(false)
    if (!result.success) {
      setError(result.message)
      return
    }

    await navigate({ to: '/' })
  }

  return (
    <div className="page">
      <Header fullname={user.fullname} isAdmin={user.isAdmin} />

      <section className="auth-card">
        <h2>Новая заявка на обучение</h2>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="course">Наименование курса</label>
          <select className="input" id="course" name="course" required>
            {COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <label htmlFor="startDate">Желаемая дата начала обучения</label>
          <input
            className="input"
            id="startDate"
            type="text"
            name="startDate"
            placeholder="ДД.ММ.ГГГГ"
            pattern="\d{2}\.\d{2}\.\d{4}"
            required
          />
          <p className="error">Укажите дату в формате ДД.ММ.ГГГГ</p>

          <fieldset className="payment-group">
            <legend>Способ оплаты</legend>
            {PAYMENT_TYPES.map((paymentType) => (
              <label key={paymentType} className="payment-option">
                <input
                  type="radio"
                  name="paymentType"
                  value={paymentType}
                  required
                />
                {paymentType}
              </label>
            ))}
          </fieldset>

          {error && <p className="error error-visible">{error}</p>}

          <button className="button-submit" type="submit" disabled={pending}>
            Отправить
          </button>
        </form>
      </section>
    </div>
  )
}
