import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ReduxProvider from "../RTK/store/Provider";
import { Toaster } from "react-hot-toast";



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
        <ReduxProvider>
          <Sidebar />

          {/* Page Content */}
          <main className="flex-1">
            {children}
          </main>

          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#111827",
                color: "#fff",
                border: "1px solid #374151",
              },
            }}
          />

          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}