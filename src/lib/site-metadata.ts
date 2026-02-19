import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://xemc-website.vercel.app";

const resolveBaseUrl = () => {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  const withProtocol = candidate.startsWith("http://") || candidate.startsWith("https://")
    ? candidate
    : `https://${candidate}`;

  return new URL(withProtocol);
};

export const metadataBase = resolveBaseUrl();

export const siteConfig = {
  name: "XEMC",
  defaultTitle: "XEMC — Software Engineer & Builder",
  defaultDescription:
    "Personal site of a full-stack engineer (ex-Google) building apps, AI agents, and web products.",
};

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  imagePath: `/${string}`;
};

export function createPageMetadata({ title, description, path, imagePath }: PageMetadataInput): Metadata {
  const isHome = path === "/";
  const fullTitle = isHome ? siteConfig.defaultTitle : `${title} | ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: imagePath,
          width: 1200,
          height: 630,
          alt: `${title} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imagePath],
    },
  };
}
