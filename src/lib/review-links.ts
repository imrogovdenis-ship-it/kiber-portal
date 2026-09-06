const reviewEnabled = import.meta.env.DESIGN_REVIEW_ENABLED === 'true' || import.meta.env.DEPLOY_ENV === 'preview';

const articleTemplateHref = '/preview/kiber-94/article-blocks/';
const articleMediaMomentHref = '/preview/kiber-94/article-blocks/#mediaMoment';

const exactReviewHrefMap = new Map<string, string>([
  ['/roboty-gumanoidy', '/preview/kiber-94/compilation/roboty-gumanoidy/'],
  ['/roboty-gumanoidy/', '/preview/kiber-94/compilation/roboty-gumanoidy/'],
  ['/sravnenie-unitree-g1-r1-h2', articleMediaMomentHref],
  ['/sravnenie-unitree-g1-r1-h2/', articleMediaMomentHref],
  ['/unitree-g1-ili-agibot-x2', articleTemplateHref],
  ['/unitree-g1-ili-agibot-x2/', articleTemplateHref],
  ['/neobychnyi-podarok-direktoru-robot', articleTemplateHref],
  ['/neobychnyi-podarok-direktoru-robot/', articleTemplateHref],
  ['/pozdravlenie-robotom-na-svadbe', articleTemplateHref],
  ['/pozdravlenie-robotom-na-svadbe/', articleTemplateHref],
  ['/robot-ofitsiant-na-meropriyatii', articleTemplateHref],
  ['/robot-ofitsiant-na-meropriyatii/', articleTemplateHref],
  ['/velkom-zona-na-svadbe-robot', articleTemplateHref],
  ['/velkom-zona-na-svadbe-robot/', articleTemplateHref],
  ['/arenda-robotov-na-meropriyatie', '/compilations/#roboty-dlya-vystavok'],
  ['/arenda-robotov-na-meropriyatie/', '/compilations/#roboty-dlya-vystavok'],
  ['/compilations', '/compilations/'],
  ['/articles', '/articles/'],
]);

export const approvedPreviewReviewRoutes = {
  home: '/',
  robotCard: '/preview/kiber-94/robot-card/arenda-unitree-g1/',
  compilationsIndex: '/compilations/',
  compilationHumanoids: '/preview/kiber-94/compilation/roboty-gumanoidy/',
  articlesIndex: '/articles/',
  articleTemplate: articleMediaMomentHref,
} as const;

export const reviewLinksAreEnabled = reviewEnabled;

export function reviewHref(href: string): string {
  if (!reviewEnabled) return href;
  const [pathAndMaybeQuery, hash = ''] = href.split('#');
  const [path, query = ''] = pathAndMaybeQuery.split('?');
  if (exactReviewHrefMap.has(href)) return exactReviewHrefMap.get(href)!;
  if (exactReviewHrefMap.has(path)) {
    const mapped = exactReviewHrefMap.get(path)!;
    if (query && mapped.startsWith('/lead/')) return `${mapped}?${query}${hash ? `#${hash}` : ''}`;
    return mapped;
  }
  const robotMatch = path.match(/^\/robots\/([^/]+)\/?$/);
  if (robotMatch) return `/preview/kiber-94/robot-card/${robotMatch[1]}/`;
  return href;
}

export function reviewRobotPreviewHref(slug: string, fallbackHref: string): string {
  if (!reviewEnabled) return fallbackHref;
  return `/preview/kiber-94/robot-card/${slug}/`;
}
