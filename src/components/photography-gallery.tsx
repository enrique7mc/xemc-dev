"use client";

import { type CSSProperties, useCallback, useEffect, useState } from "react";
import type { PhotographyPhoto } from "@/data/photography";
import styles from "@/app/photography/photography.module.css";

type PhotographyGalleryProps = {
  photos: PhotographyPhoto[];
};

type TileStyle = CSSProperties &
  Record<"--row-span" | "--row-span-tablet" | "--col-span" | "--col-span-tablet", string>;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type TileLayout = {
  colSpan: number;
  colSpanTablet: number;
  rowSpan: number;
  rowSpanTablet: number;
};

const getTileLayout = (photo: PhotographyPhoto): TileLayout => {
  const ratio = photo.height / Math.max(photo.width, 1);
  let colSpan = 4;
  let colSpanTablet = 3;

  if (ratio <= 0.78) {
    colSpan = 6;
    colSpanTablet = 6;
  } else if (ratio <= 0.95) {
    colSpan = 5;
    colSpanTablet = 4;
  } else if (ratio <= 1.6) {
    colSpan = 4;
    colSpanTablet = 3;
  } else {
    colSpan = 3;
    colSpanTablet = 2;
  }

  // Keep the grid balanced by scaling height from ratio and chosen column width.
  const rowSpan = clamp(Math.round(ratio * colSpan * 5.4), 16, 38);
  const rowSpanTablet = clamp(Math.round(ratio * colSpanTablet * 8.1), 16, 36);

  return {
    colSpan,
    colSpanTablet,
    rowSpan,
    rowSpanTablet,
  };
};

const toCounter = (index: number, total: number): string => {
  const current = String(index + 1).padStart(2, "0");
  const size = String(total).padStart(2, "0");
  return `${current}/${size}`;
};

export default function PhotographyGallery({ photos }: PhotographyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) {
        return current;
      }

      return (current + 1) % photos.length;
    });
  }, [photos.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) {
        return current;
      }

      return (current - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeLightbox, goNext, goPrevious]);

  if (photos.length === 0) {
    return <p className={styles.emptyState}>No photos yet. Add images in `src/data/photography.ts`.</p>;
  }

  const activePhoto = activeIndex === null ? null : photos[activeIndex];
  const hasManyPhotos = photos.length > 1;
  const activeCounter = activeIndex === null ? null : toCounter(activeIndex, photos.length);

  return (
    <>
      <ul className={styles.galleryGrid}>
        {photos.map((photo, index) => {
          const layout = getTileLayout(photo);
          const style: TileStyle = {
            "--col-span": `${layout.colSpan}`,
            "--col-span-tablet": `${layout.colSpanTablet}`,
            "--row-span": `${layout.rowSpan}`,
            "--row-span-tablet": `${layout.rowSpanTablet}`,
          };

          return (
            <li key={photo.id} className={styles.galleryItem} style={style}>
              <button type="button" className={styles.cardButton} onClick={() => setActiveIndex(index)}>
                {/* Using img keeps local files and future Blob URLs simple without extra Next image config. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.cardImage}
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading={index < 4 ? "eager" : "lazy"}
                />
                <span className={styles.cardOverlay}>
                  <span className={styles.cardMeta}>Open</span>
                  <span className={styles.cardCounter}>{toCounter(index, photos.length)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {activePhoto ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${activeCounter} full screen preview`}
          onClick={closeLightbox}
        >
          <div className={styles.lightboxInner} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.closeButton} onClick={closeLightbox} aria-label="Close preview">
              Close
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={goPrevious}
              disabled={!hasManyPhotos}
              aria-label="Previous photo"
            >
              Prev
            </button>
            <figure className={styles.lightboxFigure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.lightboxImage}
                src={activePhoto.src}
                alt={activePhoto.alt}
                width={activePhoto.width}
                height={activePhoto.height}
              />
              <figcaption className={styles.lightboxCaption}>
                <p className={styles.lightboxMeta}>{activeCounter}</p>
                {activePhoto.note ? <p className={styles.lightboxNote}>{activePhoto.note}</p> : null}
              </figcaption>
            </figure>
            <button
              type="button"
              className={styles.controlButton}
              onClick={goNext}
              disabled={!hasManyPhotos}
              aria-label="Next photo"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
