import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/database-url.js'
import { hashPassword } from '#/lib/hash.js'

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.user.deleteMany()

  const users = await prisma.user.createMany({
    data: [
      { email: "admin@example.com", login: "Admin", phone: "79223449123", fullname: "Админ Админович", password: await hashPassword('KorokNET') },
      { email: "testuser@example.com", login: "testuser", phone: "79223449124", fullname: "Юзер Юзерович", password: await hashPassword('testuser') },
    ],
  })

  console.log(`✅ Created ${users.count} users`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
