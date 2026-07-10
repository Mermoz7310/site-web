import type { Metadata, Viewport } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "./globals.css";

const SITE_URL = "https://221belcode.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "221BelCode — Solutions digitales sur mesure & SaaS",
    template: "%s | 221BelCode",
  },
  description:
    "221BelCode conçoit des applications web, plateformes SaaS, applications métiers, automatisations IA et dashboards Power BI. Nous transformons vos idées en solutions digitales intelligentes.",
  keywords: [
    "agence digitale", "développement SaaS", "application web sur mesure",
    "automatisation IA", "N8N", "Power BI", "Next.js", "Supabase",
    "développeur Belgique", "développeur Sénégal",
  ],
  authors: [{ name: "221BelCode" }],
  creator: "221BelCode",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: SITE_URL,
    siteName: "221BelCode",
    title: "221BelCode — Solutions digitales sur mesure & SaaS",
    description:
      "Nous transformons vos idées en solutions digitales intelligentes. Applications web, SaaS, IA et automatisation.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "221BelCode — Agence de développement digital" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "221BelCode — Solutions digitales sur mesure & SaaS",
    description: "Nous transformons vos idées en solutions digitales intelligentes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "221BelCode",
  url: SITE_URL,
  logo: SITE_URL + "/logo.png",
  slogan: "Nous transformons vos idées en solutions digitales intelligentes.",
  description:
    "Agence de développement digital spécialisée en SaaS, applications web, automatisation IA et Business Intelligence.",
  areaServed: ["BE", "SN", "NL", "FR"],
  knowsAbout: ["Développement SaaS", "Applications web", "Intelligence artificielle", "Automatisation N8N", "Business Intelligence"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
