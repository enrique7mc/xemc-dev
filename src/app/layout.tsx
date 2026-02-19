import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "XEMC | Developer Portfolio",
  description: "Editorial black and white personal website scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <div className="site-texture" aria-hidden />
        <div className="site-spotlight" aria-hidden />
        <header className="site-header">
          <Link href="/" className="site-brand">
            XEMC
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
