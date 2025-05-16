import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (session) {
    redirect("/")
  }
  return <div>{children}</div>
}

export default AuthLayout


