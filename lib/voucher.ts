const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateVoucherCode(prefix: string) {
  const safePrefix = prefix
    .toUpperCase()
    .substring(0, 3)

  let random = ""
  for (let i = 0; i < 7; i++) {
    random += CHARS[Math.floor(Math.random() * CHARS.length)]
  }

  return safePrefix + random
}

