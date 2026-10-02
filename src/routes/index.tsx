import { createFileRoute, Link } from '@tanstack/react-router'
import { Slider } from '#/components/Slider'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Портал «Корочки.есть» — запись на онлайн-курсы ДПО
      </h1>
      <Slider />
      <p>
        Зарегистрируйтесь, оставьте заявку на обучение и следите за её статусом.
      </p>
      <div className="flex gap-3">
        <Link
          to="/register"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Зарегистрироваться
        </Link>
        <Link
          to="/login"
          className="rounded border border-blue-600 px-4 py-2 text-blue-700"
        >
          Войти
        </Link>
      </div>
    </div>
  )
}