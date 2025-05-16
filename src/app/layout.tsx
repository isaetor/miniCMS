import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";

const iranSans = localFont({
  src: [
    {
      path: "./fonts/regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "./fonts/black.woff2",
      weight: "900",
      style: "black",
    },
  ],
});

export const metadata: Metadata = {
  title: "Mini CMS",
  description: "A simple CMS built with Next.js",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${iranSans.className} antialiased`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
export default RootLayout;

