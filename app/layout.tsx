import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import { Card } from "primereact/card";

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
    <html lang="th">
      <body className={`min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1 p-6 bg-gray-50">
            <Card>{children}</Card>
          </main>
        </Providers>
      </body>
    </html>
  );
}
