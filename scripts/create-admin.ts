import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('Vnvc@198', 10)

  await prisma.adminUser.create({
    data: {
      username: 'admin',
      password,
    },
  })

  console.log('Admin created')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
