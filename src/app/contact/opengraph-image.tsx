import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og-image";

export const alt = "Contact page social preview";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createOgImage({
    section: "Contact",
    title: "Let's build something sharp.",
    description: "Reach out for collaborations, consulting, or full-time opportunities.",
  });
}
