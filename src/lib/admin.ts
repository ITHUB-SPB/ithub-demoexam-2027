import { createServerFn } from '@tanstack/react-start'
import { getPrismaClient } from '../db'
import { useAppSession } from './session'
import { ENTRY_STATUSES } from './constants'

export const ADMIN_PAGE_SIZE = 5

async function requireAdmin() {
  const session = await useAppSession()
  if (!session.data.userId || session.data.isAdmin !== true) {
    return null
  }
  return session.data
}

export const getAdminEntries = createServerFn({ method: 'GET' })
  .validator((data: { status?: string, page?: number }) => data)
  .handler(async ({ data }) => {
    if (!(await requireAdmin())) {
      return { success: false as const, message: 'Доступ запрещен' }
    }

    const page = Math.max(1, data.page ?? 1)
    const where =
      data.status && (ENTRY_STATUSES as readonly string[]).includes(data.status)
        ? { status: data.status }
        : {}

    const prisma = getPrismaClient()
    const [total, entries] = await Promise.all([
      prisma.entry.count({ where }),
      prisma.entry.findMany({
        where,
        include: {
          user: {
            select: { login: true, fullname: true, phone: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * ADMIN_PAGE_SIZE,
        take: ADMIN_PAGE_SIZE,
      }),
    ])

    return {
      success: true as const,
      entries,
      total,
      page,
      pageCount: Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE)),
    }
  })

export const setEntryStatus = createServerFn({ method: 'POST' })
  .validator((data: { entryId: number, status: string }) => data)
  .handler(async ({ data }) => {
    if (!(await requireAdmin())) {
      return { success: false as const, message: 'Доступ запрещен' }
    }
    if (!(ENTRY_STATUSES as readonly string[]).includes(data.status)) {
      return { success: false as const, message: 'Некорректный статус' }
    }

    const prisma = getPrismaClient()
    await prisma.entry.update({
      where: { id: data.entryId },
      data: { status: data.status },
    })

    return {
      success: true as const,
      message: `Заявка №${data.entryId}: статус изменен на «${data.status}»`,
    }
  })
