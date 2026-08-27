import launchRoutes from '../../data/seo/launch-routes.json';

export const prerender = true;

const site = launchRoutes.site.replace(/\/$/, '');

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const urls = launchRoutes.routes
    .filter((route) => route.sitemap)
    .map((route) => {
      const loc = `${site}${route.path}`;
      const changefreq = 'changefreq' in route ? route.changefreq : 'weekly';
      const priority = 'priority' in route ? route.priority : 0.5;
      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <changefreq>${escapeXml(String(changefreq))}</changefreq>`,
        `    <priority>${Number(priority).toFixed(1)}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
