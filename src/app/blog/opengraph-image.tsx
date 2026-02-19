import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og-image";

export const alt = "Blog page social preview";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createOgImage({
    section: "Blog",
    title: "Writing that supports the work.",
    description: "Notes on frontend systems, visual decisions, and deployment tradeoffs.",
  });
}
