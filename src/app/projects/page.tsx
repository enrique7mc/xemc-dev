import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "../entry.module.css";

const drafts = [
  {
    title: "PicBox",
    summary: "Native iOS digital photo frame app with smart features like on-device face recognition for intelligent framing.",
    status: "Launched",
    url: "https://picbox.xemc.dev/",
  },
  {
    title: "LiveLog",
    summary: "View your setlist.fm concert history in a delightful way.",
    status: "Launched",
    url: "https://livelog.xemc.dev/",
  },
  {
    title: "Tazza",
    summary: "Caffeine tracking app with fast logging, widgets, and Live Activities for real-time intake tracking and daily pacing.",
    status: "In progress",
    url: "https://tazza.xemc.dev/",
  },
  {
    title: "DeclutterSpace",
    summary: "iOS storage cleaner that detects duplicate/similar photos and redundant contacts with VisionKit.",
    status: "In Progress",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description: "Selected projects and case studies focused on product outcomes and system design.",
  path: "/projects",
  imagePath: "/projects/opengraph-image",
});

export default function ProjectsPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Projects</p>
      <h1 className={styles.title}>The Lab</h1>
      <p className={styles.lead}>
        Some of these are polished. Some are experiments. All of them taught me something.
      </p>
      <ul className={styles.list}>
        {drafts.map((project, index) => (
          <li key={project.title}>
            <p className={styles.listIndex}>[{String(index + 1).padStart(2, "0")}]</p>
            <div className={styles.itemWrap}>
              <h2 className={styles.itemTitle}>
                {project.url ? (
                  <a
                    className={styles.projectLink}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h2>
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
