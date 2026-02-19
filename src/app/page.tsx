import type { Metadata } from "next";
import InteractiveHome from "@/components/interactive-home";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "XEMC — Software Engineer & Builder",
  description:
     "Personal site of a full-stack engineer (ex-Google) building apps, AI agents, and web products.",
  path: "/",
  imagePath: "/opengraph-image",
});

export default function Home() {
  return <InteractiveHome />;
}
