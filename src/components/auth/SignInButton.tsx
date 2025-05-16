"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { usePathname, useSearchParams } from "next/navigation"
import { ComponentProps } from "react"

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "google" | "github"
}

export default function SignInButton({ provider, children, ...props }: SignInButtonProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const callbackUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  const handleSignIn = () => {
    signIn(provider, { callbackUrl })
  }

  return (
    <Button
      type="button"
      onClick={handleSignIn}
      {...props}
    >
      {children}
    </Button>
  )
}
