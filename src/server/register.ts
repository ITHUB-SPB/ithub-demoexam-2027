import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../lib/prisma'
import { registerSchema } from '../lib/validation'
import bcrypt from 'bcryptjs'

export const registerUser = createServerFn({ method: 'POST' })
  .validator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const existing = await prisma.user.findUnique({
      where: { login: data.login },
    })

    if (existing) {
      return { success: false, error: 'Такой логин уже занят' }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        login: data.login,
        password: hashedPassword,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
      },
    })

    return { success: true, userId: user.id }
  })