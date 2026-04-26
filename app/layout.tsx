import type { Metadata } from "next";
import "../app/globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import { Card } from "primereact/card";
import { Kanit } from "next/font/google";

export const metadata: Metadata = {
  title: "Env Report",
  description: "Environmental Report System",
};

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-kanit",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(kanit.className);
  return (
    <html lang="th">
      <body className={`${kanit.className} min-h-screen flex flex-col`}>
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
