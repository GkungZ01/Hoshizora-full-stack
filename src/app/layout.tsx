"use client";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}>
        <div id="root" className="flex relative flex-col h-screen">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
