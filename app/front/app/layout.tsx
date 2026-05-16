import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Food Delivery CQRS",
  description: "Food delivery CQRS demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-950 antialiased">
        <div className="min-h-screen">
          <Navbar />
          <main className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}