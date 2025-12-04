import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Load the Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TicketZero - AI Triage",
  description: "Turn angry client emails into professional engineering tickets in seconds.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font to the whole body */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}