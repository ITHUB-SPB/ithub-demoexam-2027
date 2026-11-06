import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPasswordHash = await bcrypt.hash('KorokNET', 10)
  await prisma.user.upsert({
    where: { login: 'Admin' },
    update: {},
    create: {
      login: 'Admin',
      passwordHash: adminPasswordHash,
      fullName: 'Администратор',
      phone: '8(000)000-00-00',
      email: 'admin@korok.net',
      role: 'ADMIN',
    },
  })
  const courses = [
    'Основы алгоритмизации и программирования',
    'Основы веб-дизайна',
    'Основы проектирования баз данных',
  ]

  for (const title of courses) {
    await prisma.course.upsert({
      where: { title },
      update: {},
      create: { title },
    })
  }

  console.log('База данных успешно заполнена!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })