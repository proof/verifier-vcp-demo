import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verifiable Credentials Presentation Verifier - Proof",
  description:
    "A demo showcasing how merchants, financial institutions, and AI agents can use the Proof wallet to request identity-verified authorization from users via OID4VP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preload" as="image" href="/proof-logo-full-white.svg" />
        <link rel="preload" as="image" href="/orion.png" />
        <link rel="preload" as="image" href="/rectangle-ticketing.png" />
        <link rel="preload" as="image" href="/sterling-and-union.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
