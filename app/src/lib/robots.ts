import robotsSource from '../../../data/models/robots.source-of-truth.json';
import catalogCardImages from '../../../data/models/robot-catalog-card-images.live.json';

export type RobotImage = {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  role: 'hero' | 'card' | 'gallery' | 'decorative' | string;
  mediaId?: string;
  actualDescription?: string;
  reviewStatus?: string;
};

export type RobotRecord = {
  slug: string;
  name: string;
  modelName?: string;
  brand?: string;
  page: {
    url: string;
    canonical: string;
    title: string;
    h1: string;
    sourceUrl?: string;
    sourceHtml?: string;
    sourceMarkdown?: string;
  };
  category: {
    primary: string;
    labels?: string[];
    collectionSlugs?: string[];
  };
  pricing: {
    display: string;
    priceFrom?: number | null;
    currency?: string;
    unit?: string;
    sourceStatus?: string;
    packages?: Array<{ name: string; display: string; duration?: string; unit?: string }>;
    tariffs?: Record<string, { status: string; display: string; publicVisible?: boolean; bookable?: boolean }>;
  };
  includedServices?: string[];
  capabilities?: string[];
  scenarios?: string[];
  venueRequirements?: string[];
  faq?: Array<{ question: string; answer: string; source?: string }>;
  media: { images: RobotImage[]; videos?: unknown[] };
  seo: {
    seoTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    searchIntent?: string[];
    schemaTypes?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  related?: { robots?: string[]; collections?: string[]; articles?: string[]; cases?: string[] };
  proposal?: { enabled: boolean; status: string; pdfUrl?: string; version?: string };
  contentFacts?: unknown;
  normalization?: { status?: string; mediaAuditStatus?: string; priceAuditStatus?: string; notes?: string };
};

const robots = (robotsSource as { robots: RobotRecord[] }).robots;
export type CatalogCardImage = {
  slug: string;
  title: string;
  src: string;
  alt: string;
  priceTextOnLiveSite?: string;
  descriptionOnLiveSite?: string;
  visualRole?: string;
  reviewStatus: string;
};

const catalogCards = (catalogCardImages as { images: CatalogCardImage[] }).images;
const catalogCardBySlug = new Map(catalogCards.map((image) => [image.slug, image]));
const catalogOrderBySlug = new Map(catalogCards.map((image, index) => [image.slug, index]));

export function getRobots(): RobotRecord[] {
  return [...robots].sort((a, b) => {
    const orderA = catalogOrderBySlug.get(a.slug);
    const orderB = catalogOrderBySlug.get(b.slug);
    if (orderA !== undefined && orderB !== undefined) return orderA - orderB;
    if (orderA !== undefined) return -1;
    if (orderB !== undefined) return 1;
    return a.page.h1.localeCompare(b.page.h1, 'ru');
  });
}

export function getRobotBySlug(slug: string): RobotRecord | undefined {
  return robots.find((robot) => robot.slug === slug);
}

export function getRobotByUrl(url: string): RobotRecord | undefined {
  const normalized = url === '/' ? '/' : `/${url.replace(/^\/+|\/+$/g, '')}`;
  return robots.find((robot) => robot.page.url === normalized || robot.page.sourceUrl === normalized);
}

export function getHeroImage(robot: RobotRecord): RobotImage | undefined {
  return robot.media.images.find((image) => image.role === 'hero')
    ?? robot.media.images.find((image) => image.reviewStatus === 'seo_alt_generated');
}

export function getCatalogCard(robot: RobotRecord): CatalogCardImage | undefined {
  return catalogCardBySlug.get(robot.slug);
}

export function getCardImage(robot: RobotRecord): RobotImage | undefined {
  const catalogCard = catalogCardBySlug.get(robot.slug);
  if (catalogCard?.src) {
    return {
      src: catalogCard.src,
      alt: catalogCard.alt,
      role: 'catalog_card',
      reviewStatus: catalogCard.reviewStatus,
      mediaId: `${robot.slug}__catalog_card`,
      actualDescription: catalogCard.alt,
      caption: catalogCard.alt,
    };
  }
  return robot.media.images.find((image) => image.role === 'card') ?? getHeroImage(robot);
}

export function getGalleryImages(robot: RobotRecord): RobotImage[] {
  return robot.media.images.filter((image) => image.role === 'gallery' && image.reviewStatus === 'seo_alt_generated');
}

export function getRelatedRobots(robot: RobotRecord): RobotRecord[] {
  const slugs = robot.related?.robots ?? [];
  return slugs.map(getRobotBySlug).filter((item): item is RobotRecord => Boolean(item));
}

export function buildRobotJsonLd(robot: RobotRecord) {
  const image = robot.seo.ogImage || getHeroImage(robot)?.src;
  const offers = robot.pricing.priceFrom
    ? {
        '@type': 'Offer',
        priceCurrency: robot.pricing.currency || 'RUB',
        price: robot.pricing.priceFrom,
        availability: 'https://schema.org/InStock',
        url: robot.page.url,
      }
    : undefined;

  const faqJsonLd = robot.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: robot.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : undefined;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: robot.page.h1,
      description: robot.seo.metaDescription,
      provider: { '@type': 'Organization', name: 'КИБЕР ПОРТАЛ' },
      areaServed: 'Россия',
      serviceType: 'Аренда роботов для мероприятий',
      url: robot.page.url,
      image,
      offers,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог роботов', item: '/#catalog' },
        { '@type': 'ListItem', position: 3, name: robot.page.h1, item: robot.page.url },
      ],
    },
    faqJsonLd,
  ].filter(Boolean);
}
