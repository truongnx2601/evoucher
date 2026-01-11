import Credentials from "next-auth/providers/credentials"
import NextAuth from "next-auth"

export const authOptions = {
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null
        const { email, password } = credentials
        if (
          email === process.env.ADMIN_EMAIL &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", email, role: "admin" }
        }
        return null
      }
    })
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/admin/login" }
}
