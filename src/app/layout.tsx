import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Savee Atelier | Operations & Brand Management Portal",
  description:
    "Internal administration system for Savee luxury fashion house. Order fulfillment, inventory management, promotions, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-100 text-slate-900 selection:bg-gold-500 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
