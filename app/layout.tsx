import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const patrickHand = localFont({
  src: "../public/fonts/PatrickHand-Regular.ttf",
  variable: "--font-patrick",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${patrickHand.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
