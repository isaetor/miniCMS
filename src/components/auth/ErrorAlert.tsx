"use client"

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"


export function ErrorAlert() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const error = searchParams.get('error')

        if (error) {
            switch (error) {
                case 'OAuthSignin':
                    setError('خطا در ورود با حساب کاربری')
                    break
                case 'OAuthCallback':
                    setError('خطا در تایید حساب کاربری')
                    break
                case 'OAuthCreateAccount':
                    setError('خطا در ایجاد حساب کاربری')
                    break
                case 'EmailCreateAccount':
                    setError('خطا در ایجاد حساب کاربری با ایمیل')
                    break
                case 'Callback':
                    setError('خطا در تایید ورود')
                    break
                case 'OAuthAccountNotLinked':
                    setError('این ایمیل قبلاً با روش دیگری ثبت شده است')
                    break
                case 'EmailSignin':
                    setError('خطا در ارسال ایمیل')
                    break
                case 'CredentialsSignin':
                    setError('ایمیل یا رمز عبور اشتباه است')
                    break
                case 'SessionRequired':
                    setError('لطفاً وارد حساب کاربری خود شوید')
                    break
                case 'AccessDenied':
                    setError('شما به دسترسی لازم را ندارید')
                    break
                default:
                    setError('خطایی رخ داد')
            }

            const timer = setTimeout(() => {
                router.replace('/login')
                setError(null)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [searchParams, router])
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                >
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>خطا</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}
        </AnimatePresence>
    )
} 