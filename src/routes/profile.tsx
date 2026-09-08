import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUserFn } from '#/lib/getUser'


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

  return <div>Hello {user}</div>
}
