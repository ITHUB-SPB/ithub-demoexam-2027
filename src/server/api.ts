import { createServerFn } from '@tanstack/react-start'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const registerUserFn = createServerFn({ method: 'POST' })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const existing = await prisma.user.findUnique({ where: { login: data.login } })
    if (existing) {
      return { error: 'login_exists' }
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    
    await prisma.user.create({
      data: {
        login: data.login,
        passwordHash,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        role: 'USER',
      },
    })
    return { success: true }
  })
export const loginUserFn = createServerFn({ method: 'POST' })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({ where: { login: data.login } })
    
    if (!user) return { error: 'Неверный логин или пароль' }
    
    const isValid = await bcrypt.compare(data.password, user.passwordHash)
    if (!isValid) return { error: 'Неверный логин или пароль' }
    return { success: true, user: { id: user.id, login: user.login, role: user.role } }
  })


export const createApplicationFn = createServerFn({ method: 'POST' })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    if (!user) return { error: 'Сначала зарегистрируйтесь!' }

    const [day, month, year] = data.date.split('.')
    const startDate = new Date(`${year}-${month}-${day}`)

    await prisma.application.create({
      data: {
        userId: user.id,
        courseId: Number(data.courseId),
        startDate,
        paymentMethod: data.payment === 'cash' ? 'CASH' : 'TRANSFER',
        status: 'NEW',
      },
    })
    return { success: true }
  })


export const getUserApplicationsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await prisma.user.findFirst({ where: { role: 'USER' } })
    if (!user) return []

    return await prisma.application.findMany({
      where: { userId: user.id },
      include: { course: true, review: true },
      orderBy: { createdAt: 'desc' },
    })
  })

export const getAllApplicationsFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await prisma.application.findMany({
      include: { user: true, course: true },
      orderBy: { createdAt: 'desc' },
    })
  })

export const updateStatusFn = createServerFn({ method: 'POST' })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await prisma.application.update({
      where: { id: Number(data.id) },
      data: { status: data.status },
    })
    return { success: true }
  })

export const createReviewFn = createServerFn({ method: 'POST' })
  .validator((d: any) => d)
  .handler(async ({ data }) => {
    await prisma.review.create({
      data: {
        applicationId: Number(data.applicationId),
        rating: 5, 
        text: data.text,
      },
    })
    return { success: true }
  })