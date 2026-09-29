import { type SubmitEvent, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'

// import { getUser } from '#/lib/login'
import { createEntry, getEntries, updateStatus } from '#/lib/entries';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // const { login } = await getUser();

    // if (login === null) {
    //   throw redirect({ to: '/login' })
    // }

    // return { login: "testuser" }
    return { login: "Admin" }
  },
  loader: async ({ context }) => {
    const isAdmin = context.login === 'Admin'

    const { entries } = await getEntries({
      data: { username: isAdmin ? undefined : context.login }
    })

    return { login: context.login, entries }
  },
  component: Home
})

function Home() {
  const { login, entries } = Route.useLoaderData()
  const [error, setError] = useState<null | string>(null)

  const handleSubmit = async (event: SubmitEvent) => {
    const formData = new FormData(event.target)

    const result = await createEntry({
      data: {
        course: formData.get('course') as string,
        paymentType: formData.get('paymentType') as string,
        startAt: new Date(formData.get('startAt') as unknown as string),
      }
    })

    if (result.success === false) {
      setError(result.message)
      return
    }
  }

  const handleUpdate = async (id: number, status: string) => {
    const result = await updateStatus({ data: { id, status } })

    if (!result.success) {
      setError(result.message)
    }
  }

  return (
    <div className="page">
      <nav>
        <h1>KorokNET</h1>
        <span>{login}</span>
        <button>Выйти</button>
      </nav>

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
              <td>
                {login === 'Admin' ? (
                  <select onChange={(event) => handleUpdate(entry.id, event.target.value)}>
                    <option>Новая</option>
                    <option>В процессе</option>
                    <option>Завершен</option>
                  </select>
                ) : entry.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>{error}</p>
      <form className="form" action="" method="post" onSubmit={handleSubmit}>
        <select className="input" name="course" defaultValue="algo" required>
          <option value="Алгоритмы">Алгоритмы</option>
          <option value="Основы программирования">Основы программирования</option>
          <option value="СУБД">СУБД</option>
        </select>
        <select className="input" name="paymentType" defaultValue="cash" required>
          <option value="Наличными">Наличными</option>
          <option value="Переводом">Переводом</option>
        </select>
        <input className="input" type="date" name="startAt" placeholder='Дата начала' required />
        <p className="error">Заполните поле</p>
        <button className="button-submit" type="submit">Отправить</button>
      </form>
    </div>
  )
}
