import { type SubmitEvent, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'

import { getUser, logout } from '#/lib/login'
import { createEntry, getEntries, updateStatus } from '#/lib/entries';
import { getReviews, createReview } from '#/lib/reviews';

import logo from '../assets/branding/image02.jpg'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    // const { login } = await getUser();

    // if (login === null) {
    //   throw redirect({ to: '/login' })
    // }

    // return { login: "testuser" }
    return { login: "Admin" }
  },
  loader: async ({ context }) => {
    const { entries } = await getEntries({
      data: { username: null }
    })

    const { reviews } = await getReviews({
      data: { username: null }
    })

    return { login: context.login, entries, reviews }
  },
  component: Home
})

function Home() {
  const { login, entries, reviews } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const [error, setError] = useState<null | string>(null)

  const handleUpdate = async (id: number, status: string) => {
    const result = await updateStatus({ data: { id, status } })

    if (!result.success) {
      setError(result.message)
      return
    }

    await navigate({ to: '/' })
  }


  return (
    <div className="page">
      <nav className="nav">
        <h1>
          <img src={logo} className='logo' />
          KorokNET
        </h1>
        <span>{login}</span>
        <button onClick={async () => {
          await logout()
          navigate({ to: "/login" })
        }}>Выйти</button>
      </nav>

      <article>
        <h2>Заявки</h2>

        <table>
          <thead>
            <tr>
              <th>Заявитель</th>
              <th>Курс</th>
              <th>Тип оплаты</th>
              <th>Дата начала</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.user?.fullname}</td>
                <td>{entry.course}</td>
                <td>{entry.paymentType}</td>
                <td>{entry.startAt.toLocaleDateString('ru')}</td>
                <td>
                  <select
                    value={entry.status ?? "Новая"}
                    onChange={(event) => handleUpdate(entry.id, event.target.value)}
                    disabled={login !== 'Admin'}
                  >
                    <option value="Новая">Новая</option>
                    <option value="В процессе">В процессе</option>
                    <option value="Завершен">Завершен</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <article>
        <h2>Отзывы</h2>
        {!reviews.length ? <p>Не завершен ни один из курсов</p> : (
          <table>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Отзыв</th>
                <th>Дата отзыва</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td>{review.user.fullname}</td>
                  <td>{review.text}</td>
                  <td>{review.createdAt.toLocaleDateString('ru')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>
    </div>
  )
}
