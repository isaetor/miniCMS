'use server'

import { initiateOtp } from "@/lib/initiate-otp"
import { prisma } from "@/lib/prisma"

export async function sendOtp(email: string) {
  const user = await prisma.user.findUnique({ where: { email } })

  if (user && !user.isActive) {
    return { success: false, error: "حساب کاربری غیرفعال است." }
  }

  return await initiateOtp(email)
}