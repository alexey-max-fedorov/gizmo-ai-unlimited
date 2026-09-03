import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SEO_KEYWORDS, SITE } from "@/lib/constants";
import { softwareAppSchema, faqSchema, organizationSchema } from "@/lib/schema";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.seoTitle,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: SITE.author }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE.name,
    title: SITE.seoTitle,
    description: SITE.oneLiner,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.seoTitle,
    description: SITE.oneLiner,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  manifest: "/site.webmanifest",
};

const jsonLd = [softwareAppSchema(), faqSchema(), organizationSchema()];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
