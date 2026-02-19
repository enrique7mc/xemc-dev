import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Manrope, Playfair_Display } from "next/font/google";
import { metadataBase, siteConfig } from "@/lib/site-metadata";
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
  metadataBase,
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

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
            <Link href="/photography">Photography</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <p>© {currentYear} XEMC. All content and photographs. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
