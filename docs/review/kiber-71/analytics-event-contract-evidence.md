# KIBER-71 provider-neutral event contract evidence

## Summary

Adds a provider-neutral analytics event contract and CI smoke without connecting any analytics provider, production analytics ID, external script, or destination.

## Source of truth

- Event registry: `data/analytics/provider-neutral-events.json`
- CI smoke: `scripts/analytics-event-contract-smoke.mjs`
- Contract test: `tests/visual/analytics-event-contract.test.ts`
- Generated report: `docs/review/kiber-71/analytics-event-contract-report.json`

## Registered events

```text
breadcrumb_click
contact_click
form_submit_intent
messenger_click
pdf_download
phone_click
robot_card_click
scroll_depth
```

Every required KIBER-71 event defines provider-neutral payload fields:

```text
source
placement
slug
```

`pdf_download` and `scroll_depth` are reserved in the contract for future UI/provider wiring; no provider script or IDs are connected here.

## DOM event contract

The production build was scanned for all `data-analytics-event` elements. Every DOM event must use:

```text
data-analytics-event
data-analytics-source
data-analytics-placement
data-analytics-slug
```

Existing markup was normalized in:

- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/components/layout/Breadcrumbs.astro`
- `src/components/blocks/HomeHero.astro`
- `src/components/blocks/CtaStrip.astro`
- `src/components/blocks/RobotCard.astro`
- `src/components/blocks/LeadForm.astro`
- `src/pages/lead/request.astro`

## CI gate

New npm script:

```text
npm run test:analytics-events
```

`npm run ci` now runs:

```text
npm run verify && npm run test:visual-regression && npm run build:production && npm run test:performance && npm run test:routes && npm run test:analytics-events && npm run ci:baseline
```

## Validation

```text
node --import tsx --test tests/visual/analytics-event-contract.test.ts — passed
npm run build:production — passed
npm run test:analytics-events — passed
npm run ci — passed
```

Analytics smoke output:

```text
KIBER-71 analytics event contract smoke passed: 85 DOM events checked against 8 provider-neutral events.
```

Report summary:

```text
registeredEvents=8
domEventsChecked=85
domEventNames=breadcrumb_click, contact_click, form_submit_intent, messenger_click, phone_click, robot_card_click
failures=0
```

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, legal/consent policy, shared containers, external scripts, cookies, or host ports changed.
