import { type SubmitEvent, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createEntry, getEntries } from '#/lib/entries';
import { getUser, logout } from '#/lib/login'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    return { login: "testuser" }
  },
  loader: async ({ context }) => {
    const { entries } = await getEntries({
      data: { username: context.login }
    })
    return { login: context.login, entries }
  },
  component: Home
})

function Home() {
  const { login, entries } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const [error, setError] = useState<null | string>(null)

  const handleAdd = async (event: SubmitEvent) => {
    const formData = new FormData(event.target)

    const result = await createEntry({
      data: {
        paymentType: formData.get('paymentType') as string,
        course: formData.get('course') as string,
        startAt: new Date(formData.get('startAt') as unknown as string)
      }
    })
    if (!result.success) {
      setError(result.message)
      return
    }
    await navigate({ to: "/" })
  }

  return (
    <div className='page'>
      <nav className='nav'>
        <h1>
          <img src="{logo}" className='logo' />
          KorokNet
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
              <th>Курс</th>
              <th>Тип оплаты</th>
              <th>Дата начала</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.course}</td>
                <td>{entry.paymentType}</td>
                <td>{entry.startAt.toLocaleDateString('ru')}</td>
                <td>{entry.status ?? "Новая"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article>
        <h2>Новая заявка</h2>
        <p>{error}</p>
        <form action="" className='form' method='post' onSubmit={handleAdd}>
          <select name="course" className='input' defaultValue="Алгоритмы" required>
            <option value="Алгоритмы">Алгоритмы</option>
            <option value="Основы программирования">Основы программирования</option>
            <option value="СУБД">СУБД</option>
          </select>
          <select name="input" className="paymentType" defaultValue="Наличными" required>
            <option value="Наличными">Наличными</option>
            <option value="Переводом">Переводом</option>
          </select>
          <input type="date" className='date' name='startAt' placeholder='Дата начала' required />
          <p className='error'>Заполните поле</p>
          <button className='button-submit' type='submit'>Отправить</button>
        </form>
    </article>
    </div >
  )
}
