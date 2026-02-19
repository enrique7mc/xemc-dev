import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description: "Contact XEMC for collaborations, consulting work, and full-time frontend opportunities.",
  path: "/contact",
  imagePath: "/contact/opengraph-image",
});

export default function ContactPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Contact</p>
      <h1 className={styles.title}>Let&apos;s build something sharp.</h1>
      <p className={styles.lead}>
        This is the starting contact page for v1. You can keep it simple now, then expand with a form,
        scheduling link, or collaboration FAQs in the next iteration.
      </p>
      <div className={styles.links}>
        <a className={styles.contactLink} href="mailto:hello@example.com">
          hello@example.com
        </a>
        <a className={styles.contactLink} href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a
          className={styles.contactLink}
          href="https://www.linkedin.com"
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
