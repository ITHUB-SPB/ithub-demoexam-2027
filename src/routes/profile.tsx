import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserFn } from '#/lib/getUser'
import { logoutFn } from '#/lib/logout'

export const Route = createFileRoute('/profile')({
  beforeLoad: async () => {
    const user = await getUserFn()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return { user }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  async function handleClick() {
    await logoutFn()
    navigate({ to: '/login' })
  }

  return (
    <div>
      Hello {user}
      <button onClick={handleClick}>Выйти</button>
    </div>
  )
}
