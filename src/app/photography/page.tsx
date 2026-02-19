import type { Metadata } from "next";
import PhotographyGallery from "@/components/photography-gallery";
import { photographyPhotos } from "@/data/photography";
import { createPageMetadata } from "@/lib/site-metadata";
import styles from "./photography.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Photography",
  description: "A personal photography section with immersive browsing and full-screen viewing.",
  path: "/photography",
  imagePath: "/photography/opengraph-image",
});

export default function PhotographyPage() {
  return (
    <section className={styles.page}>
      <p className={styles.kicker}>Photography</p>
      <h1 className={styles.title}>A visual notebook.</h1>
      <p className={styles.lead}>
        Not professional, just personal frames worth keeping. Open any image for a full-screen view and use arrow keys
        to move through the set.
      </p>
      <PhotographyGallery photos={photographyPhotos} />
      <p className={styles.helper}>
        © {new Date().getFullYear()} XEMC. No reproduction without written permission.
      </p>
    </section>
  );
}
