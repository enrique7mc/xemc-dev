import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og-image";

export const alt = "Projects page social preview";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createOgImage({
    section: "Projects",
    title: "Selected builds, documented soon.",
    description: "Case studies focused on outcomes, stack details, and product constraints.",
  });
}
