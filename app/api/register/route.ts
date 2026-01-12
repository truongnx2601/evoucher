import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { generateVoucherCode } from "@/lib/voucher"

const EMPLOYEE_CODE_REGEX = /^(mn|hn)/i

export async function POST(req: Request) {
  try {
    const form = await req.formData()

    const rawEmployeeCode = String(form.get("employeeCode") || "").trim()
    const phone = String(form.get("phone") || "").trim()
    const fullName = String(form.get("fullName") || "").trim()
    const center = String(form.get("center") || "").trim()
    const campaignId = String(form.get("campaignId") || "").trim()


    if (
      !rawEmployeeCode ||
      !phone ||
      !fullName ||
      !center ||
      !campaignId
    ) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      )
    }


    if (!EMPLOYEE_CODE_REGEX.test(rawEmployeeCode)) {
      return NextResponse.json(
        { success: false, message: "Mã nhân viên phải bắt đầu bằng MN hoặc HN" },
        { status: 400 }
      )
    }


    const employeeCode = rawEmployeeCode.toUpperCase()

    const voucher = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {

        const campaign = await tx.campaign.findUnique({
          where: { id: campaignId }
        })

        if (!campaign || !campaign.isActive) {
          throw new Error("CAMPAIGN_INACTIVE")
        }

        const employee = await tx.employee.upsert({
          where: { employeeCode },
          update: {
            phone,
            fullName,
            center
          },
          create: {
            employeeCode,
            phone,
            fullName,
            center
          }
        })

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
          throw new Error("VOUCHER_LIMIT_REACHED")
        }

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

        throw new Error("CANNOT_GENERATE_VOUCHER")
      }
    )

    return NextResponse.json({
      success: true,
      code: voucher.code
    })
  } catch (e: any) {
    console.error(e)

    const message =
      e.message === "CAMPAIGN_INACTIVE"
        ? "Chiến dịch không còn hiệu lực"
        : e.message === "VOUCHER_LIMIT_REACHED"
        ? "Chiến dịch đã hết voucher"
        : "Có lỗi xảy ra, vui lòng thử lại"

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    )
  }
}
