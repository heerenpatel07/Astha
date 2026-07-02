import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SparkEffect from "@/components/SparkEffect";

export const metadata: Metadata = {
  title: "Aastha Steel and Profile | Commercial Steel & Fabrication",
  description: "Premium commercial steel and fabrication services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SparkEffect />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
