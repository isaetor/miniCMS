"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"

interface LoginLinkProps extends ComponentProps<typeof Button> {
  children: React.ReactNode
}

export function LoginLink({ children, ...props }: LoginLinkProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const callbackUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

  return (
    <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
      <Button {...props}>
        {children}
      </Button>
    </Link>
  )
} 