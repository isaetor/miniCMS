import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, FileTextIcon, HomeIcon, MessageCircleIcon, SquareArrowOutUpRight, TagIcon, UsersIcon } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user?.role || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="container mx-auto flex items-center justify-between p-4 border-b border-muted">
                <div className="flex items-center gap-8">
                    <h1 className="text-2xl font-bold">پنل مدیریت</h1>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2">    
                            <HomeIcon className="w-4 h-4" />
                            <span>خانه</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-2 opacity-30">
                            <FileTextIcon className="w-4 h-4" />
                            <span>مقالات</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-2 opacity-30">
                            <TagIcon className="w-4 h-4" />
                            <span>دسته‌بندی‌ها</span>
                        </Link>
                        <Link href="/dashboard/comments" className="flex items-center gap-2">
                            <MessageCircleIcon className="w-4 h-4" />
                            <span>نظرات</span>
                        </Link>
                        <Link href="#" className="flex items-center gap-2 opacity-30">
                            <UsersIcon className="w-4 h-4" />
                            <span>کاربران</span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/">
                        <Button variant="outline" size="sm">
                            <span>انتقال به سایت</span>
                            <SquareArrowOutUpRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <Button variant="destructive" size="sm">
                            خروج از حساب
                        </Button>
                    </form>
                </div>
            </header>

            <main className="flex-1 overflow-auto">
                {children}
            </main>

            <footer className="container mx-auto border-t border-muted text-center p-4 text-sm text-muted-foreground">
                © ۲۰۲۵ - همه حقوق محفوظ است
            </footer>
        </div>
    );
};

export default DashboardLayout;
