import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export const getUserApplications = createServerFn({ method: 'GET' })
  .validator((data: { userId: number }) => data)
  .handler(async ({ data }) => {
    const applications = await prisma.application.findMany({
      where: { userId: data.userId },
      include: { review: true },
      orderBy: { id: 'desc' },
    })
    return { success: true, applications }
  })

const reviewSchema = z.object({
  applicationId: z.number(),
  text: z.string().min(5, 'Отзыв должен быть не короче 5 символов'),
})

export const createReview = createServerFn({ method: 'POST' })
  .validator((data: unknown) => reviewSchema.parse(data))
  .handler(async ({ data }) => {
    const app = await prisma.application.findUnique({
      where: { id: data.applicationId },
      include: { review: true },
    })

    if (!app) return { success: false, error: 'Заявка не найдена' }
    if (app.status !== 'Обучение завершено') {
      return { success: false, error: 'Отзыв только после завершения обучения' }
    }
    if (app.review) {
      return { success: false, error: 'Отзыв уже оставлен' }
    }

    const review = await prisma.review.create({
      data: { applicationId: data.applicationId, text: data.text },
    })

    return { success: true, review }
  })
  import { applicationSchema } from '../lib/validation'

export const createApplication = createServerFn({ method: 'POST' })
  .validator((data: unknown) =>
    applicationSchema.extend({ userId: z.number() }).parse(data)
  )
  .handler(async ({ data }) => {
    const application = await prisma.application.create({
      data: {
        userId: data.userId,
        courseName: data.courseName,
        startDate: data.startDate,
        paymentMethod: data.paymentMethod,
        status: 'Новая',
      },
    })

    return { success: true, application }
  })
  export const getAllApplications = createServerFn({ method: 'GET' })
  .handler(async () => {
    const applications = await prisma.application.findMany({
      include: {
        user: { select: { login: true, fullName: true, phone: true } },
        review: true,
      },
      orderBy: { id: 'desc' },
    })

    return { success: true, applications }
  })
  const statusSchema = z.object({
  applicationId: z.number(),
  status: z.enum(['Новая', 'Идет обучение', 'Обучение завершено']),
})

export const updateApplicationStatus = createServerFn({ method: 'POST' })
  .validator((data: unknown) => statusSchema.parse(data))
  .handler(async ({ data }) => {
    const updated = await prisma.application.update({
      where: { id: data.applicationId },
      data: { status: data.status },
    })

    return { success: true, application: updated }
  })