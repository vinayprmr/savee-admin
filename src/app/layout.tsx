import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Savee | Brand & Operations Management Portal",
  description:
    "Internal administration system for Savee fashion brand. Order fulfillment, inventory management, promotions, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${sansFont.className} font-sans antialiased bg-slate-100 text-slate-900 selection:bg-gold-500 selection:text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
