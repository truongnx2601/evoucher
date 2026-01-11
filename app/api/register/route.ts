import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { generateVoucherCode } from "@/lib/voucher"

export async function POST(req: Request) {
  const form = await req.formData()

  const employeeCode = form.get("employeeCode") as string
  const phone = form.get("phone") as string
  const fullName = form.get("fullName") as string
  const center = form.get("center") as string
  const campaignId = form.get("campaignId") as string

  try {
    const voucher = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {

        const campaign = await tx.campaign.findUnique({
          where: { id: campaignId }
        })

        if (!campaign || !campaign.isActive) {
          throw new Error("Campaign inactive")
        }

        const employee = await tx.employee.upsert({
          where: { employeeCode },
          update: {},
          create: { employeeCode, phone, fullName, center }
        })

        // CHECK TRÙNG
        const existingVoucher = await tx.voucher.findUnique({
          where: {
            campaignId_employeeId: {
              campaignId,
              employeeId: employee.id
            }
          }
        })

        if (existingVoucher) {
          return existingVoucher
        }

        const count = await tx.voucher.count({
          where: { campaignId }
        })

        if (count >= campaign.maxVoucher) {
          throw new Error("Voucher limit reached")
        }


        // TẠO MỚI
        for (let i = 0; i < 5; i++) {
          try {
            return await tx.voucher.create({
              data: {
                code: generateVoucherCode(campaign.prefix),
                campaignId,
                employeeId: employee.id
              }
            })
          } catch (e: any) {
            if (e.code !== "P2002") throw e
          }
        }

        throw new Error("Cannot generate voucher")
      }
    )

    return NextResponse.json({
      success: true,
      code: voucher.code
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { success: false },
      { status: 500 }
    )
  }
}
