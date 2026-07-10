import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://221belcode.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/#services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#realisations`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/#contact`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
