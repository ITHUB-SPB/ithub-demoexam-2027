import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/database-url.js'
import { hashPassword } from '#/lib/hash.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

const COURSES = [
  'Основы алгоритмизации и программирования',
  'Основы веб-дизайна',
  'Основы проектирования баз данных',
]

const STATUSES = ['Новая', 'Идет обучение', 'Обучение завершено']

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.entry.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({
    data: {
      login: 'Admin',
      email: 'admin@koroknet.ru',
      phone: '8(922)344-91-23',
      fullname: 'Администратор Портала',
      password: await hashPassword('KorokNET'),
    },
  })

  const user = await prisma.user.create({
    data: {
      login: 'testuser',
      email: 'testuser@example.com',
      phone: '8(922)344-91-24',
      fullname: 'Иванов Иван Иванович',
      password: await hashPassword('testuser'),
    },
  })

  const entries = Array.from({ length: 8 }, (_, i) => ({
    userId: user.id,
    course: COURSES[i % COURSES.length],
    paymentType: i % 2 === 0 ? 'Наличными' : 'Переводом по номеру телефона',
    startAt: new Date(2026, 11, 10 + i),
    status: STATUSES[i % STATUSES.length],
    review:
      STATUSES[i % STATUSES.length] === 'Обучение завершено' && i % 2 === 0
        ? 'Отличный курс, материал подан понятно и по делу!'
        : null,
  }))

  await prisma.entry.createMany({ data: entries })

  console.log(`✅ Created 2 users and ${entries.length} entries`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
