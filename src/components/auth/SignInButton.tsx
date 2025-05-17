"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { ComponentProps } from "react"

interface SignInButtonProps extends ComponentProps<typeof Button> {
  provider: "google" | "github"
  callbackUrl?: string
}

export default function SignInButton({ provider, children, callbackUrl, ...props }: SignInButtonProps) {

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
