import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../lib/prisma'
import { loginSchema } from '../lib/validation'
import bcrypt from 'bcryptjs'

export const loginUser = createServerFn({ method: 'POST' })
  .validator((data: unknown) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { login: data.login },
    })

    if (!user) {
      return { success: false, error: 'Неверный логин или пароль' }
    }

    const isValid = await bcrypt.compare(data.password, user.password)

    if (!isValid) {
      return { success: false, error: 'Неверный логин или пароль' }
    }

    return {
      success: true,
      user: { id: user.id, login: user.login, fullName: user.fullName },
    }
  })