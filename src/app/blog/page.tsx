import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

const drafts = [
  {
    title: "Designing Interfaces That Survive Growth",
    summary: "Principles for keeping UI systems coherent as products evolve.",
    status: "Draft",
  },
  {
    title: "When To Break Visual Symmetry",
    summary: "Using imbalance to create hierarchy without harming clarity.",
    status: "Outline",
  },
  {
    title: "How I Ship Frontend Work on Vercel",
    summary: "Practical deployment flow, guardrails, and performance checks.",
    status: "Queued",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Writing on frontend systems, interface craft, and practical deployment workflows.",
  path: "/blog",
  imagePath: "/blog/opengraph-image",
});

export default function BlogPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Blog</p>
      <h1 className={styles.title}>Writing that supports the work.</h1>
      <p className={styles.lead}>
        You have the blog entry point in place. We can now add MDX or a CMS source and publish these as full
        articles when you are ready.
      </p>
      <ul className={styles.list}>
        {drafts.map((post, index) => (
          <li key={post.title}>
            <p className={styles.listIndex}>[{String(index + 1).padStart(2, "0")}]</p>
            <div className={styles.itemWrap}>
              <h2 className={styles.itemTitle}>{post.title}</h2>
              <p>{post.summary}</p>
            </div>
            <p className={styles.listMeta}>{post.status}</p>
          </li>
        ))}
      </ul>
      <Link className={styles.backLink} href="/">
        Back to home
      </Link>
    </section>
  );
}
