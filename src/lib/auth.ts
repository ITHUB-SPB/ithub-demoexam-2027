import { createServerFn } from '@tanstack/react-start'
import { useAppSession } from './session'

export const getSessionUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    const { userId, login, fullname, isAdmin } = session.data

    if (!userId || !login || !fullname) {
      return null
    }

    return { userId, login, fullname, isAdmin: isAdmin === true }
  },
)

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  await session.clear()
  return { success: true }
})
