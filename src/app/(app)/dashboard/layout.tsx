import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();

    if (!session?.user?.role || session.user.role !== "ADMIN") {
        redirect("/");
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default DashboardLayout