import type { Metadata } from "next";
import Link from "next/link";

import { butterflyKids, dmSans } from "@/fonts";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    dmSans.className,
                    "dark flex min-h-screen overflow-hidden"
                )}
            >
                <header className="container absolute inset-x-0 z-50 flex max-w-none items-center justify-between px-8 py-2">
                    <Link
                        href="/"
                        className={cn(
                            "text-5xl font-bold",
                            butterflyKids.className
                        )}
                    >
                        illostack
                    </Link>
                </header>
                {children}
            </body>
        </html>
    );
}
