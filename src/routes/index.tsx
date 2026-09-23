import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '#/lib/login'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const { login } = await getUser();

    if (login === null) {
      throw redirect({ to: '/login' })
    }

    return { login }
  },
  loader: async ({ context }) => {
    return context.login
  },
  component: Home
})

function Home() {
  const login = Route.useLoaderData()

  return (
    <div className="page">
      <nav>
        <h1>KorokNET</h1>
        <span>{login}</span>
        <button>Выйти</button>
      </nav>

      <h2>Заявки</h2>

      <form className="form" action="" method="post">
        <select className="input" name="course" defaultValue="algo" required>
          <option value="algo">Алгоритмы</option>
          <option value="coding">Основы программирования</option>
          <option value="rdbs">СУБД</option>
        </select>
        <select className="input" name="paymentType" defaultValue="cash" required>
          <option value="cash">Наличными</option>
          <option value="card">Переводом</option>
        </select>
        <input className="input" type="date" name="startDate" placeholder='Дата начала' required />
        <p className="error">Заполните поле</p>
        <button className="button-submit" type="submit">Отправить</button>
      </form>
    </div>
  )
}
