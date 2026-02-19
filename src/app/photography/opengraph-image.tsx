import { createOgImage, ogImageContentType, ogImageSize } from "@/lib/og-image";

export const alt = "Photography page social preview";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OpenGraphImage() {
  return createOgImage({
    section: "Photography",
    title: "Personal frames worth keeping.",
    description: "An interactive gallery section with immersive full-screen viewing.",
  });
}
