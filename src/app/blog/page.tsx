import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

const drafts = [
  {
    title: "Building a Caffeine Tracker for iPhone / Apple Watch",
    summary: "SwiftUI, HealthKit, and WidgetKit. Shipping Tazza from idea to App Store.",
    status: "Draft",
  },
  {
    title: "Giving AI Agents Persistent Memory",
    summary: "Embeddings, knowledge graphs, and what it takes to make an agent that actually remembers.",
    status: "Outline",
  },
  {
    title: "The iOS Storage Cleaner Market is Absurd",
    summary: "Sensor Tower data, $10M/mo from simple apps, and what it means for indie developers.",
    status: "Queued",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Writing on iOS development, AI agents, and lessons from shipping indie apps.",
  path: "/blog",
  imagePath: "/blog/opengraph-image",
});

export default function BlogPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Blog</p>
      <h1 className={styles.title}>Writing that supports the work.</h1>
      <p className={styles.lead}>
        Thinking out loud about AI-powered development and the future of software engineering. Posts coming soon.
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
