import Image from "next/image"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"
import { BellIcon, FileTextIcon, Home, LayoutDashboardIcon, LayoutPanelLeft, LogOutIcon, MessageCircleIcon, Plus, PlusSquareIcon, UserCircleIcon, UserIcon } from "lucide-react";
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
import { formatAuthorName } from "@/lib/utils";
import { Button } from "../ui/button";

const Header = async () => {
    const session = await auth();
    return (
        <>
            <header className="hidden md:block">
                <div className="container mx-auto p-4">
                    <div className="flex items-center justify-between gap-4">
                        <Nav />
                        <div className="flex items-center gap-4">
                            <Link href="/articles/new">
                                <Button className="rounded-full !pl-6">
                                    <Plus />
                                    ایجاد مقاله
                                </Button>
                            </Link>
                            {session && (
                                <DropdownMenu dir="rtl">
                                    <DropdownMenuTrigger>
                                        <Image className="size-10 rounded-full" src={session.user?.image ?? "/images/default-avatar.jpg"} alt="Profile" width={40} height={40} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel className="grid flex-1 text-sm leading-tight">
                                            <span className="truncate font-medium mb-1">{formatAuthorName(session.user?.firstName, session.user?.lastName)}</span>
                                            <span className="truncate text-xs text-muted-foreground">{session.user?.email}</span>
                                        </DropdownMenuLabel>
                                        {session.user.role === "ADMIN" && (

                                            <Link href="/dashboard">
                                                <DropdownMenuItem>
                                                    <LayoutDashboardIcon />
                                                    پنل مدیریت
                                                </DropdownMenuItem>
                                            </Link>

                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>

                                            <Link href="/profile/articles">
                                                <DropdownMenuItem>
                                                    <FileTextIcon />
                                                    مقالات من
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/profile">
                                                <DropdownMenuItem>
                                                    <UserCircleIcon />
                                                    حساب کاربری
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/profile/comments">
                                                <DropdownMenuItem>
                                                    <MessageCircleIcon />
                                                    دیدگاه ها
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href="/profile/notifications">
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
                                <LoginLink className="rounded-full" variant="outline">
                                    ورود / ثبت نام
                                </LoginLink>
                            )}
                        </div>
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
                    <Link href="/articles/new">
                        <PlusSquareIcon />
                    </Link>
                    <Link href="/profile/notifications">
                        <BellIcon />
                    </Link>
                    {session ? (
                        <Link href="/profile">
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