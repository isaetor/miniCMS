"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useCallback, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { emailSchema } from "@/lib/validations/auth"
import { motion } from "motion/react"
import { GithubIcon, GoogleIcon } from "../icons"
import SignInButton from "./SignInButton"

interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>
  isLoading: boolean
  initialEmail?: string
}

export function EmailForm({ onSubmit, isLoading, initialEmail = '' }: EmailFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (initialEmail) {
      validateEmail(initialEmail)
    }
  }, [initialEmail])

  const validateEmail = useCallback((email: string) => {
    setIsValidating(true)

    const result = emailSchema.safeParse({ email })

    if (!result.success) {
      setEmailError(result.error.errors[0].message)
      setIsEmailValid(false)
    } else {
      setEmailError(null)
      setIsEmailValid(true)
    }

    setIsValidating(false)
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(email)
  }, [email, onSubmit])

  return (
    <>
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              dir="ltr"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value)
              }}
              className={emailError ? "border-red-500" : ""}
            />
            {!isValidating && emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <Button disabled={isLoading || !isEmailValid || isValidating}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            ارسال کد تایید
          </Button>
        </div>
      </motion.form>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              یا ورود با
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SignInButton provider="google" variant="outline">
            <GoogleIcon className="mr-2 h-4 w-4" />
            گوگل
          </SignInButton>
          <SignInButton provider="github" variant="outline">
            <GithubIcon className="mr-2 h-4 w-4" />
            گیت هاب
          </SignInButton>
        </div>
      </motion.div>
    </>
  )
} 