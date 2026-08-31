# Font licensing status

## Production decision

Montserrat is the only production typeface for КИБЕР ПОРТАЛ. It is used for display and body typography through design tokens.

## Montserrat

- Status: approved for self-hosting and commercial website use.
- License: SIL Open Font License 1.1.
- Runtime files: Cyrillic WOFF2, weights 400/500/600/700.
- License text: `public/fonts/montserrat/OFL.txt`.
- CSS: `src/styles/fonts.css`.
- Source tokens: `design-system/tokens/primitive/typography.yaml`.

## Gilroy / Gillroy

- Status: deliberately not used.
- The supplied archive has no verified web-license grant and is not published.
- Gilroy files and Tilda CDN URLs must not be added to runtime, fixtures or generated assets.
- Reintroducing Gilroy requires a new explicit owner decision, documented web license and a separate reviewable change.

This decision keeps typography reproducible and legally auditable without changing component markup.
