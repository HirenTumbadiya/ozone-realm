import type { Metadata } from "next";
import { Audiowide, Orbitron } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootLayoutClient from "@/client/RootLayoutClient";
import ToastProvider from "@/providers/ToastProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700"],
});

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-audiowide",
});

export const metadata: Metadata = {
  title: "OZONE-REALM",
  description:
    "A Next.js 14+ template with Clerk authentication, Tailwind CSS, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${audiowide.className} ${orbitron.variable}`}>
          <RootLayoutClient>
            <ToastProvider />
            {children}
          </RootLayoutClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
