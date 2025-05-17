"use client"

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { sendOtp } from "@/app/actions/auth/send-otp"
import { verifyOtp } from "@/app/actions/auth/verify-otp"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "motion/react"
import { EmailForm } from "./EmailForm"
import { OtpForm } from "./OtpForm"
import { ErrorAlert } from "./ErrorAlert"
import Image from "next/image"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  console.log(callbackUrl)
  const handleEmailSubmit = useCallback(async (email: string) => {
    setIsLoading(true)
    try {
      const result = await sendOtp(email)
      if (result.success) {
        if (result.existingCode) {
          toast.info('کد تایید قبلا ارسال شده است')
        } else {
          toast.success('کد تایید به ایمیل شما ارسال شد')
        }
        setEmail(email)
        setStep('code')
      } else {
        toast.error(result.error as string || "خطا در ارسال کد تایید")
      }
    } catch (error) {
      toast.error('خطا در ارسال کد تایید')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleOtpSubmit = useCallback(async (code: string) => {
    setIsLoading(true)
    try {
      const result = await verifyOtp(email, code)
      if (result.success) {
        toast.success('ورود موفقیت‌آمیز')
        router.push(callbackUrl)
      } else {
        toast.error(result.error as string || "خطا در تایید کد")
      }
    } catch (error) {
      toast.error('خطا در تایید کد')
    } finally {
      setIsLoading(false)
    }
  }, [email, router, callbackUrl])

  const handleBack = useCallback(() => {
    setStep('email')
  }, [])

  return (
    <div className="grid w-[300px] gap-6">
      <div className="flex flex-col items-center gap-6 pb-6">
        <Image src="/images/logo_small.svg" alt="logo" width={32} height={32} />
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-center">
            {step === 'email' ? 'ورود / ثبت نام' : 'تایید ایمیل'}
          </h2>
          <p className="text-sm text-muted-foreground text-center">
            {step === 'email' ? 'جهت ورود به حساب کاربری ایمیل خود را وارد کنید' : 'کد ارسال شده به ایمیل خود را وارد کنید'}
          </p>
        </div>
      </div>
      <AnimatePresence>
        {step === 'email' && (
          <EmailForm
            onSubmit={handleEmailSubmit}
            initialEmail={email}
            isLoading={isLoading}
            callbackUrl={callbackUrl}
          />
        )}

        {step === 'code' && (
          <OtpForm
            onSubmit={handleOtpSubmit}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>

      <ErrorAlert />
    </div>
  )
}

export default LoginForm
