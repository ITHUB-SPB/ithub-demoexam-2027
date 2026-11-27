import { createServerFn } from '@tanstack/react-start'
import { getPrismaClient } from '../db'
import { verifyHash } from './hash'
import { useAppSession } from './session'
import { ADMIN_LOGIN } from './constants'

type Result = {
  success: true
  isAdmin: boolean
} | {
  success: false
  message: string
}

export const login = createServerFn({ method: 'POST' })
  .validator((data: {
    login: string,
    password: string,
  }) => data)
  .handler(async ({ data }): Promise<Result> => {
    const prisma = getPrismaClient()

    const user = await prisma.user.findUnique({
      where: { login: data.login },
    })

    if (!user || !(await verifyHash(data.password, user.password))) {
      return { success: false, message: 'Неверный логин или пароль' }
    }

    const session = await useAppSession()
    await session.update({
      userId: user.id,
      login: user.login,
      fullname: user.fullname,
      isAdmin: user.login === ADMIN_LOGIN,
    })

    return { success: true, isAdmin: user.login === ADMIN_LOGIN }
  })
