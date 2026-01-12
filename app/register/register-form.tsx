"use client"

import { useState } from "react"
import { VoucherResult } from "./result"

type Campaign = {
  id: string
  name: string
}

const EMPLOYEE_CODE_REGEX = /^(mn|hn)/i

export default function RegisterForm({
  campaigns
}: {
  campaigns: Campaign[]
}) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const employeeCode = String(formData.get("employeeCode") || "").trim()

    if (!EMPLOYEE_CODE_REGEX.test(employeeCode)) {
      setError("Mã nhân viên phải bắt đầu bằng MN hoặc HN")
      return
    }

    formData.set("employeeCode", employeeCode.toUpperCase())

    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData
      })

      const data = await res.json()

      if (data.success) {
        setCode(data.code)
      } else {
        setError(data.message ?? "Có lỗi xảy ra")
      }
    } catch {
      setError("Không thể kết nối tới server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Nhận Voucher
      </h1>

      {!code ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="employeeCode"
            placeholder="Mã nhân viên"
            className="border p-2 w-full"
            required
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
            }}
          />

          <input
            name="fullName"
            placeholder="Họ tên"
            className="border p-2 w-full"
            required
          />

          <input
            name="phone"
            placeholder="Số điện thoại"
            className="border p-2 w-full"
            required
          />

          <input
            name="center"
            placeholder="Trung tâm"
            className="border p-2 w-full"
            required
          />

          <select
            name="campaignId"
            required
            className="border p-2 w-full"
            defaultValue=""
          >
            <option value="" disabled>
              -- Chọn chiến dịch --
            </option>

            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="bg-black text-white w-full py-2 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Nhận voucher"}
          </button>
        </form>
      ) : (
        <VoucherResult code={code} />
      )}
    </div>
  )
}
