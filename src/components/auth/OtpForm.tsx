"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState, useCallback } from "react"
import { Loader2, EditIcon } from "lucide-react"
import { motion } from "motion/react"
import { InputOTPGroup } from "../ui/input-otp"
import { InputOTPSlot } from "../ui/input-otp"
import { InputOTP } from "../ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

interface OtpFormProps {
  onSubmit: (code: string) => Promise<void>
  onBack: () => void
  isLoading: boolean
}

export function OtpForm({ onSubmit, onBack, isLoading }: OtpFormProps) {
  const [code, setCode] = useState('')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(code)
  }, [code, onSubmit])

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="code">کد تایید</Label>
          <div dir="ltr">
            <InputOTP
              id="code"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              disabled={isLoading}
              value={code}
              onChange={(value) => setCode(value)}
            >
              <InputOTPGroup className="mx-auto">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <Button disabled={isLoading || code.length !== 6}>
          {isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          تایید کد
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
        >
          <EditIcon size={16} />
          ویرایش ایمیل
        </Button>
      </div>

    </motion.form>
  )
} 