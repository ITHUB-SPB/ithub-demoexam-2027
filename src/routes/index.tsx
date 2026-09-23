import { type SubmitEvent, useState } from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router'

// import { getUser } from '#/lib/login'
import { createEntry } from '#/lib/entries';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // const { login } = await getUser();

    // if (login === null) {
    //   throw redirect({ to: '/login' })
    // }

    return { login: "testuser" }
  },
  loader: async ({ context }) => {
    return context.login
  },
  component: Home
})

function Home() {
  const login = Route.useLoaderData()

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

  const [error, setError] = useState<null | string>(null)

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
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <select name="" id="">
                <option>Новая</option>
                <option>В процессе</option>
                <option>Завершен</option>
              </select>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      <p>{error}</p>
      <form className="form" action="" method="post" onSubmit={handleSubmit}>
        <select className="input" name="course" defaultValue="algo" required>
          <option value="algo">Алгоритмы</option>
          <option value="coding">Основы программирования</option>
          <option value="rdbs">СУБД</option>
        </select>
        <select className="input" name="paymentType" defaultValue="cash" required>
          <option value="cash">Наличными</option>
          <option value="card">Переводом</option>
        </select>
        <input className="input" type="date" name="startAt" placeholder='Дата начала' required />
        <p className="error">Заполните поле</p>
        <button className="button-submit" type="submit">Отправить</button>
      </form>
    </div>
  )
}
