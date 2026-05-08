import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SPK Ranking SAW",
  description: "Decision Support System using Simple Additive Weighting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <div className="flex min-h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
