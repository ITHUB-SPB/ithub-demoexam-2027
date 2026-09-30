import { useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'

import { getUser, logout } from '#/lib/login'
import { getEntries, updateStatus } from '#/lib/entries';
import { getReviews } from '#/lib/reviews';

import logo from '../assets/branding/image02.jpg'

type Filters = {
  paymentType: string | null,
  course: string | null
}

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

  const [currentFilters, setCurrentFilters] = useState<Filters>({
    paymentType: null,
    course: null
  })

  const [currentPage, setCurrentPage] = useState<number>(1)

  const getVisibleEntries = () => {
    let filteredEntries = [...entries]

    if (currentFilters.paymentType) {
      filteredEntries = filteredEntries.filter(
        ({ paymentType }) => paymentType === currentFilters.paymentType
      )
    }

    if (currentFilters.course) {
      filteredEntries = filteredEntries.filter(
        ({ course }) => course === currentFilters.course
      )
    }

    return filteredEntries
  }

  const pages = Math.ceil(getVisibleEntries().length / 3)

  const handleCourseFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFilters(filters => ({
      ...filters,
      course: event.target.value === "null" ? null : event.target.value
    }))
  }

  const handlePaymentFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFilters(filters => ({
      ...filters,
      paymentType: event.target.value === "null" ? null : event.target.value
    }))
  }

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
        <div className="entries-admin">
          <h2>Заявки</h2>
          <select onChange={handleCourseFilter}
            className="input input--filter"
            value={currentFilters['course'] ?? ""}
          >
            <option value="null">Все курсы</option>
            <option value="Алгоритмы">Алгоритмы</option>
            <option value="Основы программирования">Основы программирования</option>
            <option value="СУБД">СУБД</option>
          </select>
          <select onChange={handlePaymentFilter} className="input input--filter" value={currentFilters['paymentType'] ?? ""}>
            <option value="null">Все виды оплаты</option>
            <option value="Наличными">Наличными</option>
            <option value="Переводом">Переводом</option>
          </select>
        </div>

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
            {getVisibleEntries().slice((currentPage - 1) * 3, currentPage * 3).map(entry => (
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
        {pages > 1 ? (
          <section className='pagination'>
            {Array(pages).fill(null).map((_, index) => (
              <button className={`pagination-button ${index + 1 === currentPage ? 'pagination-button--active' : ''}`} onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
            ))}
          </section>
        ) : null}

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
