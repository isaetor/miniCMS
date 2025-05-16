"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Nav = () => {
    const pathname = usePathname();
    return (
        <div className="flex items-center gap-8">
            {pathname !== "/" && (
                <Link href="/">
                    <Image src="/images/logo.svg" alt="Mini CMS" width={100} height={32} />
                </Link>
            )}
            <nav className="items-center gap-6 hidden md:flex">
                <Link className={`text-muted-foreground ${pathname === "/" ? "text-primary font-bold" : ""}`} href="/">خانه</Link>
                <Link className={`text-muted-foreground ${pathname === "/about" ? "text-primary font-bold" : ""}`} href="/about">درباره ما</Link>
                <Link className={`text-muted-foreground ${pathname === "/contact" ? "text-primary font-bold" : ""}`} href="/contact">تماس با ما</Link>
            </nav>
        </div>
    )
}

export default Nav;