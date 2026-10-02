import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DreamHome - Find Your Dream Property",
  description:
    "Buy, Rent or Invest in the best properties across Lucknow",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">


        <Sidebar />
        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}