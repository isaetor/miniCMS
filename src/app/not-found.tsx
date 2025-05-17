"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">صفحه‌ای که دنبالشی پیدا نشد!</h2>
        <p className="text-muted-foreground mb-6">
          شاید آدرس را اشتباه وارد کردی یا صفحه حذف شده باشد.
        </p>
        <Button onClick={() => router.back()} className="gap-2">
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه قبل
        </Button>
      </div>
    </div>
  );
}
