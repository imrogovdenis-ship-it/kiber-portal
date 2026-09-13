import approvedArticles from '../../data/content/launch-articles.json';
import { homeGosha, homeCompilations, homeRobotCardFinalCta, type HomeCardsBlock } from '../data/home-live';
import type { ArticleBlocksTemplateData, ArticleRobotCard } from './approved-article-5-types';
import type { CompilationPageTemplateData, CompilationRobotCard } from './kiber94-compilation-template-data';
import { getRobotPageBySlug } from './robot-pages';
import mediaProvenance from '../../data/media/robot-dogs-preview/provenance.json';
import sciencePackage from '../../data/content-inbox/dogs-approved/robot-dlya-nauchnogo-shou-i-shkoly.content-package.json';
import exhibitionPackage from '../../data/content-inbox/dogs-approved/robot-stendist-dlya-vystavki.content-package.json';
import dogsPackage from '../../data/content-inbox/dogs-approved/roboty-sobaki.content-package.json';
import unitreePackage from '../../data/content-inbox/dogs-approved/roboty-unitree-obzor-kompanii.content-package.json';
import comparisonPackage from '../../data/content-inbox/dogs-approved/sravnenie-robosobak-dlya-meropriyatiy.content-package.json';
import go2Package from '../../data/content-inbox/dogs-approved/unitree-go2-na-meropriyatii.content-package.json';
import cyberdogPackage from '../../data/content-inbox/dogs-approved/xiaomi-cyberdog-2-v-promo-akciyah.content-package.json';

type PackageMedia = { mediaId: string; alt: string; actualDescription?: string; seoAlt?: string; caption?: string };
type PackageCard = { title: string; href: string; description?: string; status?: string };
type PackageBlock = Record<string, any>;
type ApprovedPackage = {
  pageType: 'article_detail' | 'compilation';
  slug: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalPath: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    h1: string;
    breadcrumbs: { label: string; href: string }[];
  };
  aiVisibility?: { aiSummary?: string };
  seoIntent?: Record<string, unknown>;
  blocks: Record<string, PackageBlock>;
  media: PackageMedia[];
};

const articlePackages = [sciencePackage, exhibitionPackage, unitreePackage, comparisonPackage, go2Package, cyberdogPackage] as ApprovedPackage[];
const compilationPackage = dogsPackage as ApprovedPackage;
const provenanceItems = (mediaProvenance as { items: Array<{ slug: string; mediaId: string; runtimePath: string; alt: string; actualDescription?: string; seoAlt?: string }> }).items;

const fallbackImage = { src: '/images/home-live/tild3632-3236-4238-b335-623531393036-hi.webp', alt: 'Кибер Гоша помогает выбрать робота для мероприятия' };

function breadcrumbs(pkg: ApprovedPackage) {
  return pkg.seo.breadcrumbs.map((item) => ({ name: item.label, url: item.href === '/compilations' ? '/compilations/' : item.href }));
}

function runtimeImage(pkg: ApprovedPackage, image?: PackageBlock) {
  if (image?.src?.startsWith('/images/kiber-94-preview/')) return {src: image.src, alt: image.alt, actualDescription: image.actualDescription, seoAlt: image.seoAlt};
  const mediaId = image?.mediaId ?? pkg.media[0]?.mediaId;
  const media = pkg.media.find((item) => item.mediaId === mediaId) ?? pkg.media[0];
  const provenance = provenanceItems.find((item) => item.slug === pkg.slug && item.mediaId === media?.mediaId);
  return {
    src: provenance?.runtimePath ?? fallbackImage.src,
    alt: image?.alt ?? media?.alt ?? fallbackImage.alt,
    actualDescription: image?.actualDescription ?? media?.actualDescription,
    seoAlt: image?.seoAlt ?? media?.seoAlt,
  };
}

function cleanQuote(value = '') {
  return value.replace(/^\*\*/, '').replace(/\*\*$/, '');
}

function packageGosha(block?: PackageBlock) {
  return {
    ...homeGosha,
    text: `${cleanQuote(block?.quote ?? '')}

${block?.text ?? ''}`.trim(),
  };
}

function cta(block?: PackageBlock) {
  return { ...homeRobotCardFinalCta, title: block?.title ?? homeRobotCardFinalCta.title, description: block?.description ?? homeRobotCardFinalCta.description };
}

function robotCategory(slug: string) {
  if (slug.includes('go2') || slug.includes('cyberdog') || slug.includes('inchbot')) return 'Робот-собака';
  if (slug.includes('promobot')) return 'Промо-робот';
  return 'Робот-гуманоид';
}

function robotCards(slugs: string[], placement: 'article' | 'collection') {
  return slugs.map((slug, index) => {
    const robot = getRobotPageBySlug(slug);
    if (!robot) throw new Error(`Unknown robot slug in robot dogs preview package: ${slug}`);
    return {
      slug: robot.slug,
      href: robot.route,
      title: robot.identity.name,
      category: robotCategory(robot.slug),
      price: robot.pricing.display,
      price_disclaimer: 'Не является публичной офертой' as const,
      description: robot.seo.description,
      badge: index === 0 ? 'По теме' : undefined,
      image: robot.media.hero,
      analytics: { event: 'robot_card_click' as const, placement, position: index + 1 },
    };
  });
}

function normalizeHref(href: string) {
  if (href === '/compilations') return '/compilations/';
  return href;
}

function textCard(card: PackageCard) {
  const slug = card.href.split('/').filter(Boolean).pop();
  const relatedPackage = [...articlePackages, compilationPackage].find((pkg) => pkg.slug === slug || pkg.seo.canonicalPath === card.href);
  const existingArticle = approvedArticles.find((item) => item.canonicalHref === card.href);
  return {
    title: card.title,
    description: card.description ?? relatedPackage?.seo.metaDescription ?? existingArticle?.description ?? 'Материал КИБЕР ПОРТАЛ по выбору робота для мероприятия.',
    href: normalizeHref(card.href),
    originalHref: card.href,
    cta: 'Читать',
    image: relatedPackage ? runtimeImage(relatedPackage, relatedPackage.blocks.hero?.heroImage) : existingArticle?.image ?? fallbackImage,
  };
}

function relatedCards(block: PackageBlock | undefined, fallbackTitle: string, ownerSlug?: string): HomeCardsBlock {
  const excludedForExhibition = /Xiaomi|CyberDog|Inchbot/i;
  const cards = (block?.cards ?? []).map(textCard).filter((card: ReturnType<typeof textCard>) => {
    if (ownerSlug !== 'robot-stendist-dlya-vystavki') return true;
    return !excludedForExhibition.test(JSON.stringify(card));
  });
  return {
    title: block?.title ?? fallbackTitle,
    description: block?.description ?? block?.lead ?? 'Подборка внутренних материалов по теме.',
    cards,
  };
}

function compilationCards(block: PackageBlock): HomeCardsBlock {
  const cards = (block.cardOrder as number[]).map((index) => {
    const card = homeCompilations.cards[index];
    if (!card) throw new Error(`Unknown homepage compilation card: ${index}`);
    const ready = index === 0 || index === 2 || index === 4;
    return { ...card, originalHref: undefined, href: ready ? card.href : '', disabled: !ready, cta: ready ? card.cta : 'Скоро' };
  });
  return {title: block.title, description: block.description ?? '', cards};
}

function plainTextBlock(id: string, block: PackageBlock) {
  return { type: 'plainText' as const, id, title: block.title, paragraphs: block.paragraphs ?? [] };
}

function orderedArticleBlocks(pkg: ApprovedPackage) {
  return Object.entries(pkg.blocks)
    .filter(([id]) => !['hero', 'seoIntro', 'faq', 'cta2', 'catalogBlock', 'relatedArticles', 'relatedCompilations'].includes(id))
    .map(([id, block]) => {
      if (block.blockType === 'plainText' || id.startsWith('plainText')) return plainTextBlock(id, block);
      if (id === 'goshaQuote') return { type: 'goshaQuote' as const, id, gosha: packageGosha(block) };
      if (id === 'mediaMoment') return { type: 'mediaMoment' as const, id, eyebrow: block.eyebrow, title: block.title, description: block.lead, image: runtimeImage(pkg, block.image), caption: block.caption };
      if (id === 'checkpointList') return { type: 'checkpointList' as const, id, eyebrow: block.eyebrow, title: block.title, items: (block.items ?? []).map((item: string | { title: string; text: string }) => typeof item === 'string' ? { title: '', text: item } : item) };
      if (id === 'comparisonBlock') return { type: 'comparisonBlock' as const, id, eyebrow: block.eyebrow, title: block.title, description: block.lead, table: block.table };
      return null;
    })
    .filter(Boolean);
}

export function buildRobotDogsPreviewArticle(pkg: ApprovedPackage): ArticleBlocksTemplateData & { slug: string } {
  const catalog = pkg.blocks.catalogBlock;
  const hero = pkg.blocks.hero;
  const seoIntro = pkg.blocks.seoIntro;
  const media = runtimeImage(pkg, hero?.heroImage);
  return {
    slug: pkg.slug,
    seo: {
      title: pkg.seo.metaTitle,
      description: pkg.seo.metaDescription,
      canonical: pkg.seo.canonicalPath,
      h1: pkg.seo.h1,
      primaryKeyword: pkg.seo.primaryKeyword,
      secondaryKeywords: pkg.seo.secondaryKeywords,
    },
    breadcrumbs: breadcrumbs(pkg),
    blockVariants: [],
    hero: { eyebrow: hero?.eyebrow ?? 'Блог Кибер Гоши', lead: hero?.lead ?? pkg.seo.metaDescription, image: media, imageAlign: 'right' },
    aiSummary: pkg.aiVisibility?.aiSummary ?? pkg.seo.metaDescription,
    gosha: packageGosha(pkg.blocks.goshaQuote),
    finalCta: cta(pkg.blocks.cta2),
    relatedArticles: relatedCards(pkg.blocks.relatedArticles, 'Блог Кибер Гоши', pkg.slug),
    relatedCompilations: compilationCards(pkg.blocks.relatedCompilations),
    robots: robotCards(catalog?.robotSlugs ?? [], 'article') as ArticleRobotCard[],
    faq: { title: pkg.blocks.faq?.title ?? 'Вопросы и ответы', items: pkg.blocks.faq?.items ?? [] },
    articleContent: {
      showInventory: false,
      gallery: pkg.blocks.gallery ? { title: pkg.blocks.gallery.title, description: pkg.blocks.gallery.description, images: pkg.blocks.gallery.images.map((image: PackageBlock) => runtimeImage(pkg, image)) } : undefined,
      seoIntro: { eyebrow: seoIntro?.eyebrow ?? 'Коротко о главном', title: seoIntro?.title, paragraphs: seoIntro?.paragraphs ?? [] },
      mediaMoment: pkg.blocks.mediaMoment ? { eyebrow: pkg.blocks.mediaMoment.eyebrow, title: pkg.blocks.mediaMoment.title, description: pkg.blocks.mediaMoment.lead, image: runtimeImage(pkg, pkg.blocks.mediaMoment.image), caption: pkg.blocks.mediaMoment.caption } : undefined,
      checklist: pkg.blocks.checkpointList ? { eyebrow: pkg.blocks.checkpointList.eyebrow, title: pkg.blocks.checkpointList.title, description: '', items: pkg.blocks.checkpointList.items ?? [] } : undefined,
      catalog: catalog ? { eyebrow: catalog.eyebrow, title: catalog.title, description: catalog.description } : undefined,
      relatedArticles: pkg.blocks.relatedArticles ? { eyebrow: pkg.blocks.relatedArticles.eyebrow, title: pkg.blocks.relatedArticles.title, description: pkg.blocks.relatedArticles.description ?? pkg.blocks.relatedArticles.lead ?? '' } : undefined,
      relatedCompilations: pkg.blocks.relatedCompilations ? { eyebrow: pkg.blocks.relatedCompilations.eyebrow, title: pkg.blocks.relatedCompilations.title, description: pkg.blocks.relatedCompilations.description ?? pkg.blocks.relatedCompilations.lead ?? '' } : undefined,
      orderedPackageBlocks: orderedArticleBlocks(pkg) as any,
    },
  };
}

export function getRobotDogsPreviewArticles() {
  return articlePackages.map(buildRobotDogsPreviewArticle);
}

export function getRobotDogsPreviewArticle(slug: string) {
  return getRobotDogsPreviewArticles().find((article) => article.slug === slug);
}

export function getRobotDogsPreviewCompilation(): CompilationPageTemplateData {
  const pkg = compilationPackage;
  const blocks = pkg.blocks;
  const hero = blocks.hero;
  return {
    seo: { title: pkg.seo.metaTitle, description: pkg.seo.metaDescription, canonical: pkg.seo.canonicalPath, h1: pkg.seo.h1, primaryKeyword: pkg.seo.primaryKeyword, secondaryKeywords: pkg.seo.secondaryKeywords },
    breadcrumbs: breadcrumbs(pkg),
    hero: { eyebrow: hero?.eyebrow ?? 'Подборка', lead: hero?.lead ?? pkg.seo.metaDescription, image: runtimeImage(pkg, hero?.heroImage) },
    aiSummary: pkg.aiVisibility?.aiSummary ?? pkg.seo.metaDescription,
    intro: { title: blocks.intro?.title, paragraphs: blocks.intro?.paragraphs ?? [] },
    gallery: { title: blocks.gallery?.title, lead: blocks.gallery?.lead, images: (blocks.gallery?.images ?? [hero?.heroImage]).filter(Boolean).map((image: PackageBlock) => runtimeImage(pkg, image)) },
    guide: { title: blocks.choiceGuide?.title, lead: blocks.choiceGuide?.lead, steps: blocks.choiceGuide?.steps ?? [] },
    video: { enabled: false, title: 'Видео не используется в этом preview', lead: 'Kinescope и существующие видео остаются без изменений.', embedHint: 'Видео отключено для пакета роботов-собак' },
    scenarios: { presentation: 'photo-gallery', title: blocks.scenarioExplanation?.title, lead: blocks.scenarioExplanation?.lead, items: (blocks.scenarioExplanation?.items ?? []).map((item: PackageBlock, index: number) => ({ title: item.title, text: item.text, image: runtimeImage(pkg, item.image ?? blocks.gallery?.images?.[index] ?? hero?.heroImage) })) },
    catalog: { eyebrow: blocks.catalogBlock?.eyebrow, title: blocks.catalogBlock?.title, lead: blocks.catalogBlock?.description, robots: robotCards(blocks.catalogBlock?.robotSlugs ?? [], 'collection') as CompilationRobotCard[] },
    relatedArticles: { title: blocks.relatedArticles?.title, lead: blocks.relatedArticles?.lead ?? blocks.relatedArticles?.description, cards: (blocks.relatedArticles?.cards ?? []).map(textCard) },
    faq: { title: blocks.faq?.title, items: blocks.faq?.items ?? [] },
    gosha: packageGosha(blocks.introGosha),
    conclusionGosha: packageGosha(blocks.goshaConclusion),
    finalCta: cta(blocks.cta2),
    showOtherCompilations: true,
    otherCompilations: (blocks.otherCompilations?.cards ?? []).map((card: PackageCard) => ({ title: card.title, text: card.description ?? 'Соседняя подборка КИБЕР ПОРТАЛ.', href: normalizeHref(card.href) })),
  };
}

export const robotDogsPreviewRoutes = [
  { title: compilationPackage.seo.h1, href: compilationPackage.seo.canonicalPath, type: 'Подборка' },
  ...articlePackages.map((pkg) => ({ title: pkg.seo.h1, href: pkg.seo.canonicalPath, type: 'Статья' })),
];
