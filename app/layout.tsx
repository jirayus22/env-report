import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Env Report",
  description: "Environmental Report System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          {/* ✅ Navbar ด้านบน */}
          <Navbar />

          {/* ✅ เนื้อหาหลัก */}
          <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
