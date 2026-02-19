import type { Metadata } from "next";
import InteractiveHome from "@/components/interactive-home";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Developer Portfolio",
  description:
    "Portfolio homepage for XEMC featuring frontend engineering work, editorial UI direction, and shipped web products.",
  path: "/",
  imagePath: "/opengraph-image",
});

export default function Home() {
  return <InteractiveHome />;
}
