export type Breadcrumb = { name: string; url: string };

const siteUrl = 'https://www.kiber-portal.ru';

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function breadcrumbJsonLd(items: Breadcrumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : absoluteUrl(item.url),
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'КИБЕР ПОРТАЛ',
    url: siteUrl,
    logo: absoluteUrl('/favicon.svg'),
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'КИБЕР ПОРТАЛ',
    url: siteUrl,
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'Organization',
      name: 'КИБЕР ПОРТАЛ',
    },
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    image: input.image ? absoluteUrl(input.image) : absoluteUrl('/assets/placeholders/robot-card.svg'),
    serviceType: input.category ?? 'Аренда роботов для мероприятий',
    areaServed: input.areaServed ?? 'RU',
    provider: {
      '@type': 'Organization',
      name: 'КИБЕР ПОРТАЛ',
      url: siteUrl,
    },
  };
}

export function contactPageJsonLd(input: { title: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: 'ru-RU',
    isPartOf: websiteJsonLd(),
  };
}

export function collectionPageJsonLd(input: { title: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: 'ru-RU',
    isPartOf: websiteJsonLd(),
  };
}

export function webPageJsonLd(input: { title: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: 'ru-RU',
    isPartOf: websiteJsonLd(),
  };
}

export function faqPageJsonLd(input: { items: { question: string; answer: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
