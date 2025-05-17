import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewArticleLayout ({ children }: { children: React.ReactNode }) {
    const session = await auth();
    
    if (!session?.user) {
        redirect(`/login?callbackUrl=${encodeURIComponent("/articles/new")}`);
    }

    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
} 