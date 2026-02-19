import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

const drafts = [
  {
    title: "Product Documentation Portal",
    summary: "Complex developer docs platform with fast search and contributor tooling.",
    status: "Case study soon",
  },
  {
    title: "Ecommerce Design System",
    summary: "Token-driven frontend system used across storefront and admin surfaces.",
    status: "In progress",
  },
  {
    title: "Realtime Monitoring Dashboard",
    summary: "Dense data interface for operations with focus on readability and speed.",
    status: "Write-up pending",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description: "Selected frontend projects and case studies focused on product outcomes and system design.",
  path: "/projects",
  imagePath: "/projects/opengraph-image",
});

export default function ProjectsPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Projects</p>
      <h1 className={styles.title}>Selected builds, documented soon.</h1>
      <p className={styles.lead}>
        This page is ready for full case studies. For now, these project entries mark the structure we can
        expand with outcomes, stack details, and process notes.
      </p>
      <ul className={styles.list}>
        {drafts.map((project, index) => (
          <li key={project.title}>
            <p className={styles.listIndex}>[{String(index + 1).padStart(2, "0")}]</p>
            <div className={styles.itemWrap}>
              <h2 className={styles.itemTitle}>{project.title}</h2>
              <p>{project.summary}</p>
            </div>
            <p className={styles.listMeta}>{project.status}</p>
          </li>
        ))}
      </ul>
      <Link className={styles.backLink} href="/">
        Back to home
      </Link>
    </section>
  );
}
