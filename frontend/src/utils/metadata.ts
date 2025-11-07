// Utilitaires pour les métadonnées SEO

import { Metadata } from "next";

export function createPageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | W.ALLfit`,
      description,
      url: `${baseUrl}${path}`,
      siteName: "W.ALLfit",
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | W.ALLfit`,
      description,
    },
  };
}

