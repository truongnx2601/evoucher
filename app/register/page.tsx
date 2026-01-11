import { prisma } from "@/lib/prisma"
import RegisterForm from "./register-form"

export default async function RegisterPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true
    }
  })

  return (
    <RegisterForm campaigns={campaigns} />
  )
}
