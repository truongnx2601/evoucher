import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.campaign.createMany({
    data: [
      { name: "Year End Party", prefix: "YEP", isActive: true, maxVoucher: 2000 },
    ],
    skipDuplicates: true
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
