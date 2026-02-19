import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact xemc.dev for collaborations, consulting work, and full-time opportunities.",
  path: "/contact",
  imagePath: "/contact/opengraph-image",
});

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Contact</p>
      <h1 className={styles.title}>Let&apos;s build something sharp.</h1>
      <p className={styles.lead}>
        If you're working on something interesting, want to collaborate, or just want to geek out about how something works, reach out.”
      </p>
      <div className={styles.links}>
        <a className={styles.contactLink} href="mailto:hello@xemc.dev">
          hello@xemc.dev
        </a>
        <a className={styles.contactLink} href="https://github.com/enrique7mc" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a
          className={styles.contactLink}
          href="https://www.linkedin.com/in/enrique7mc"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
      <Link className={styles.backLink} href="/">
        Back to home
      </Link>
    </section>
  );
}
