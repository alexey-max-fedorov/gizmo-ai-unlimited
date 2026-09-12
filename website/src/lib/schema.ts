import { FAQ, PRIMARY_CAPABILITIES, SITE, STORES } from "./constants";

export function softwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    operatingSystem: "Chrome, Edge, Brave, Firefox",
    applicationCategory: "BrowserApplication",
    description: SITE.description,
    url: SITE.url,
    softwareVersion: SITE.version,
    featureList: [...PRIMARY_CAPABILITIES],
    downloadUrl: [STORES.chrome, STORES.edge, STORES.firefox],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: SITE.author,
    },
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    sameAs: [SITE.repo],
  };
}
