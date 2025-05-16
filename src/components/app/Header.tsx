import Image from "next/image"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { BellIcon, Home, LayoutPanelLeft, LogOutIcon, MessageCircleIcon, UserCircleIcon, UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Nav from "./Nav";
import { LoginLink } from "../auth/LoginLink";

const Header = async () => {
    const session = await auth();
    return (
        <>
            <header className="hidden md:block">
                <div className="container mx-auto p-4">
                    <div className="flex items-center justify-between gap-4">
                        <Nav />
                        {session && (
                            <DropdownMenu dir="rtl">
                                <DropdownMenuTrigger>
                                    {session.user?.image ? (
                                        <Image className="size-10 rounded-full" src={session.user?.image} alt="Profile" width={40} height={40} />
                                    ) : (
                                        <div className="size-10 rounded-full bg-muted flex items-center justify-center"><UserIcon /></div>
                                    )}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel className="grid flex-1 text-sm leading-tight">
                                        <span className="truncate font-medium">{session.user?.firstName} {session.user?.lastName}</span>
                                        <span className="truncate text-xs text-muted-foreground">{session.user?.email}</span>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <Link href="/account">
                                            <DropdownMenuItem>
                                                <UserCircleIcon />
                                                حساب کاربری
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/account/comments">
                                            <DropdownMenuItem>
                                                <MessageCircleIcon />
                                                دیدگاه ها
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/account/notifications">
                                            <DropdownMenuItem>
                                                <BellIcon />
                                                اطلاع رسانی ها
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <form action={async () => {
                                        "use server"
                                        await signOut()
                                    }}>
                                        <DropdownMenuItem asChild>
                                            <button className="w-full" type="submit">
                                                <LogOutIcon />
                                                خروج
                                            </button>
                                        </DropdownMenuItem>
                                    </form>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {!session && (
                            <LoginLink>
                                ورود / ثبت نام
                            </LoginLink>
                        )}
                    </div>

                </div>
            </header>
            <div className="md:hidden max-w-[400px] fixed bottom-4 left-4 right-4 mx-auto bg-background border p-4 rounded-lg z-50">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <Home />
                    </Link>
                    <Link href="/categories">
                    <LayoutPanelLeft />
                    </Link>
                    <Link href="/account/notifications">
                        <BellIcon />
                    </Link>
                    {session ? (
                    <Link href="/account">
                            <Image className="size-8 rounded-full" src={session.user?.image ?? "/images/default-avatar.jpg"} alt="Profile" width={32} height={32} />
                        
                    </Link>
                    ) : (
                        <Link href="/login">
                            <UserIcon />
                        </Link>
                    )}
                </div>
            </div>
        </>
    )
}

export default Header