// Approved internal related-card sections. Built-site regression checks this list against actual rendered cards.
const robotSlugs = new Set(['arenda-robota-ardi','arenda-robota-tron','arenda-noetix-bumi','arenda-unitree-g1','arenda-agibot-x2','arenda-robota-sofiya','arenda-unitree-r1','arenda-promobot-v4','arenda-unitree-h2']);
export function usesDeferredCardImages(pathname: string): boolean {
 const path = pathname.replace(/\/$/, '');
 return /^\/articles\/[^/]+$/.test(path) || ['/roboty-gumanoidy','/roboty-sobaki'].includes(path) || (path.startsWith('/robots/') && robotSlugs.has(path.slice('/robots/'.length)));
}
