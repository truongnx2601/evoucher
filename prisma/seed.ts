import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.campaign.createMany({
    data: [
      { name: "Tết 2026", prefix: "TET26", isActive: true },
      { name: "Khai trương", prefix: "OPEN", isActive: false }
    ],
    skipDuplicates: true
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
