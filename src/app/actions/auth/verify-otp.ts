'use server'

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function verifyOtp(email: string, code: string) {
  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      expiresAt: { gt: new Date() },
    },
  })

  if (!record) {
    return { success: false, error: "کد وارد شده نامعتبر یا منقضی شده است." }
  }

  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        isActive: true,
      },
    })
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email,
    })

    await prisma.otpCode.deleteMany({ where: { email } })

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}
