# SEO и structured data

- JSON-LD создаётся только через `src/lib/seo.ts`.
- BreadcrumbList соответствует видимым breadcrumbs.
- FAQPage строится только из FAQ на текущей странице.
- Service, Organization и Article не содержат невидимых пользователю утверждений.
- Production получает canonical, уникальные title/description и только опубликованные URL в sitemap.
- Preview получает `noindex, nofollow`, `X-Robots-Tag`; production analytics в preview отключена.
