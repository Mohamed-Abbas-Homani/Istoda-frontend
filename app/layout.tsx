import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const patrickHand = localFont({
  src: "../public/fonts/PatrickHand-Regular.ttf",
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Istoda",
  description: "Let her stay alive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${patrickHand.variable}`}>{children}</body>
    </html>
  );
}
