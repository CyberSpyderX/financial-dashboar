import type { Metadata } from "next";
import { Poppins } from "next/font/google"
import { Toaster } from "sonner";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs'
import { cn } from "@/lib/utils"
import QueryProvider from "@/providers/QueryProvider";
import SheetProvider from "@/providers/SheetProvider";

const poppins = Poppins({
  weight: ['200', '300', '400', '600'],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            poppins.className
          )}
        >
          <QueryProvider>
            <SheetProvider />
            <Toaster />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
