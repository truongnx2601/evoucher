export function VoucherResult({ code }: { code: string }) {
  function copy() {
    navigator.clipboard.writeText(code)
    alert("Đã copy voucher!")
  }

  return (
    <div className="border p-6 text-center space-y-4">
      <p className="text-gray-500">Voucher của bạn</p>

      <div className="text-2xl font-mono font-bold">
        {code}
      </div>

      <button
        onClick={copy}
        className="bg-green-600 text-white px-4 py-2"
      >
        Copy voucher
      </button>
    </div>
  )
}
