// prisma/seed.ts

import { prisma } from '../src/db'


async function main() {
  await prisma.user.upsert({
    where: { login: 'Admin' },
    update: {},
    create: {
      login: 'Admin',
      password: 'KorokNET',
      fullName: 'Администратор Системы',
      phone: '8(999)000-00-00',
      email: 'admin@korok.net',
      role: 'ADMIN',
    },
  })
  console.log('Admin создан')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())