import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/sass/bootstrap.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/css/global.css";
import Header from "../app/componets/Header";
import Footer from "../app/componets/Footer";
import BootstrapClient from "./componets/bootstrap-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instituto Interactivo",
  description: "Generated by Sam and Lino",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main className="container ">
          <div className="fondImage"></div>
          {children}
        </main>
        <Footer />
        <BootstrapClient />
      </body>
    </html>
  );
}
