# Font licensing status

## Montserrat

- Status: approved for self-hosting.
- License: SIL Open Font License 1.1.
- Runtime files: Cyrillic WOFF2, weights 400/500/600/700.
- CSS: `src/styles/fonts.css`.

## Gilroy / Gillroy

- Status: blocked for self-hosting until a web license is confirmed.
- The supplied TTF archive contains copyright metadata but no license grant.
- Tilda CDN URLs are not copied into the new runtime.
- Temporary fallback: `Arial, sans-serif` through the display-font token.
- After approval, add licensed WOFF2 files and update only `src/styles/fonts.css` plus this record.

This policy keeps typography replaceable without changing component markup or block specs.
