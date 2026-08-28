import internalLinks from '../../data/seo/internal-links.json';

export type InternalLinkStatus = 'approved' | 'generated_needs_review' | 'rejected' | 'disabled';

export type InternalLink = {
  id: string;
  status: InternalLinkStatus;
  publicRender: boolean;
  sourceRoute: string;
  targetRoute: string;
  href: string;
  anchor: string;
  intent: 'proof-content' | 'category-discovery' | 'conversion-cta';
  reason: string;
};

type InternalLinkRegistry = {
  schemaVersion: number;
  issue: 'KIBER-52';
  autoPublishGenerated: boolean;
  policy: {
    maxLinksPerPage: number;
    renderOnlyStatus: 'approved';
  };
  links: InternalLink[];
};

const registry = internalLinks as InternalLinkRegistry;
const GENERATED_NEEDS_REVIEW: InternalLinkStatus = 'generated_needs_review';

export function normalizeRoute(path: string) {
  const pathname = path.split('?')[0].split('#')[0] || '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function getApprovedInternalLinksForRoute(route: string) {
  if (registry.autoPublishGenerated) return [];

  const sourceRoute = normalizeRoute(route);
  return registry.links
    .filter((link) => link.status !== GENERATED_NEEDS_REVIEW)
    .filter((link) => link.status === registry.policy.renderOnlyStatus)
    .filter((link) => link.publicRender === true)
    .filter((link) => normalizeRoute(link.sourceRoute) === sourceRoute)
    .slice(0, registry.policy.maxLinksPerPage);
}

export function getInternalLinkPolicy() {
  return registry.policy;
}

export function getInternalLinkRegistry() {
  return registry;
}
