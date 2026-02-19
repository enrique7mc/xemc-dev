import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og-image";

export const alt = "XEMC portfolio social preview";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createOgImage({
    section: "Home",
    title: "Code with editorial taste.",
    description: "Frontend engineering and deliberate interface craft by XEMC.",
  });
}
