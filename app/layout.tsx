import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "./components/providers/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const outFit = Outfit({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Manage your budget smoothly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en" suppressHydrationWarning>
        <body
          className={outFit.className} suppressHydrationWarning
        >
          <div className="mb-40" suppressHydrationWarning>
            <Toaster richColors position="bottom-right" />
            <RootProviders>
              {children}
            </RootProviders>
          </div>
        </body>
      </html>
    </ClerkProvider >
  );
}
