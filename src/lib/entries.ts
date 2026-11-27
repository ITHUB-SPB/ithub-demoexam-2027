import { createServerFn } from '@tanstack/react-start'
import { getPrismaClient } from '../db'
import { useAppSession } from './session'
import { COURSES, PAYMENT_TYPES, STATUS_DONE, STATUS_NEW } from './constants'

function parseStartDate(input: string): Date | null {
  const match = input.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!match) {
    return null
  }
  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export const createEntry = createServerFn({ method: 'POST' })
  .validator((data: {
    course: string,
    startDate: string,
    paymentType: string,
  }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      return { success: false as const, message: 'Необходимо авторизоваться' }
    }

    if (!(COURSES as readonly string[]).includes(data.course)) {
      return { success: false as const, message: 'Выберите курс из списка' }
    }

    const startAt = parseStartDate(data.startDate)
    if (!startAt) {
      return { success: false as const, message: 'Укажите дату в формате ДД.ММ.ГГГГ' }
    }

    if (!(PAYMENT_TYPES as readonly string[]).includes(data.paymentType)) {
      return { success: false as const, message: 'Выберите способ оплаты' }
    }

    const prisma = getPrismaClient()
    await prisma.entry.create({
      data: {
        course: data.course,
        paymentType: data.paymentType,
        startAt,
        status: STATUS_NEW,
        userId: session.data.userId,
      },
    })

    return { success: true as const }
  })

export const getMyEntries = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await useAppSession()
    if (!session.data.userId) {
      return []
    }

    const prisma = getPrismaClient()
    return prisma.entry.findMany({
      where: { userId: session.data.userId },
      orderBy: { createdAt: 'desc' },
    })
  },
)

export const addReview = createServerFn({ method: 'POST' })
  .validator((data: { entryId: number, review: string }) => data)
  .handler(async ({ data }) => {
    const session = await useAppSession()
    if (!session.data.userId) {
      return { success: false as const, message: 'Необходимо авторизоваться' }
    }

    const review = data.review.trim()
    if (!review) {
      return { success: false as const, message: 'Введите текст отзыва' }
    }

    const prisma = getPrismaClient()
    const entry = await prisma.entry.findUnique({ where: { id: data.entryId } })

    if (!entry || entry.userId !== session.data.userId) {
      return { success: false as const, message: 'Заявка не найдена' }
    }
    if (entry.status !== STATUS_DONE) {
      return {
        success: false as const,
        message: 'Отзыв можно оставить только после завершения обучения',
      }
    }

    await prisma.entry.update({
      where: { id: entry.id },
      data: { review },
    })

    return { success: true as const }
  })
