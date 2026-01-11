"use client"
import { useState } from "react"
import { VoucherResult } from "./result"

type Campaign = {
  id: string
  name: string
}

export default function RegisterForm({
  campaigns
}: {
  campaigns: Campaign[]
}) {
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const res = await fetch("/api/register", {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setCode(data.code)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Nhận Voucher
      </h1>

      {!code ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="employeeCode" placeholder="Mã nhân viên" className="border p-2 w-full" required />
          <input name="fullName" placeholder="Họ tên" className="border p-2 w-full" required />
          <input name="phone" placeholder="Số điện thoại" className="border p-2 w-full" required />
          <input name="center" placeholder="Trung tâm" className="border p-2 w-full" required />

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

          <button
            disabled={loading}
            className="bg-black text-white w-full py-2"
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
