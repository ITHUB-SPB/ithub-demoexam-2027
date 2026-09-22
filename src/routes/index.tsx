import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="page">
      <nav>
        <h1>KorokNET</h1>
        <span>Testuser2</span>
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
