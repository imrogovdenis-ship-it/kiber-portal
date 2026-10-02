# KIBER article style contract

Status: **owner_approved**
Owner approval note: Александр утвердил текущий пакет контрактов как рабочий source of truth; дальнейшие правки вносятся в эти файлы по ходу работы.

## Voice and audience

Write for a potential customer, not for an internal reviewer, SEO report or developer.

Every text block should help the reader understand:
- what happens at the event;
- why the robot/format fits;
- what the guest sees/does;
- what the organizer must check;
- what to ask the manager;
- what limitation matters.

Avoid dry logistics as the main tone. Keep logistics in checklists or practical paragraphs, not as the whole article voice.

## Headings

H1/H2/H3 must be understandable without knowing robot names.

Bad:
- `Турнир с SenseRobot`
- `Unitree Go2 на мероприятии`
- `Робобар после официальной части`

Good:
- `Шахматный турнир с роботом SenseRobot`
- `Робот-собака Unitree Go2 как фотомомент`
- `Робот-бармен Робобар: барная зона после официальной части`

Apply the same role+model/function rule in table row labels, quick-choice cards, catalog descriptions and FAQ when model names are introduced.

## Typography and shared visual constraints

Recorded current rules for owner re-confirmation:

- H1/H2/H3 use the owner-selected “typography A / привычная” direction.
- Body text, body size/line-height, blue section labels and main shared blocks are not to be changed unless explicitly approved.
- Blue button color stays as currently implemented; previous darkening from `#0088ff` to `#0070d3` was rejected.
- Approved internal-page gray is recorded as `#6e6f84`; home gray remains separate.
- FAQ, CTA2, catalog, related articles and compilations should reuse shared homepage/PR8 styles. Article pages may change content/selection, not shared layout/colors/spacing, without new approval.

## Editorial entry diversity

Before writing the first H2 / SEO intro, choose an editorial entry angle from `docs/contracts/kiber-article-editorial-angles-contract.md`. Do not default every article to “the robot works better when it has a role”. That principle is useful for multi-robot scenarios, but it is not a universal opening.

If none of the 20 approved angles fits a topic — for example, an article about a real exhibition, news event, venue circumstance, partner case or non-robot context — define a custom angle, record it in the review notes/SEO passport, and add it to the contract if reusable.

Diversity QA before preview: compare the article with the last 3–5 drafts and ensure the first H2, Gosha joke, first body blocks, FAQ and checklist are not a mechanical repeat of recent articles.

## Kiber Gosha micro-contract

Kiber Gosha is an editorial accent, not a filler block.

`HomeGoshaQuote.astro` renders the first paragraph with bold styling (`home-gosha__quote`). Therefore text must be intentionally structured.

### Standard two-paragraph pattern

Paragraph 1:
- memorable joke, useful observation or recommendation;
- usually 1–3 short sentences;
- can use “как робот человеку” when natural, but not mechanically every time.

Paragraph 2:
- normal-weight manager handoff;
- usually one sentence, about 12–25 words;
- must match article promise;
- must not duplicate the full checklist.

### Logic-specific handoffs

Single-focus article:
```text
Менеджер поможет выбрать одну сильную роль под ваш формат: <2–3 short options>.
```

Multi-robot combined scenario:
```text
Менеджер поможет собрать роли в один сценарий и развести форматы по времени или зонам.
```

Comparison article:
```text
Менеджер поможет сравнить модели под вашу аудиторию, площадку и длительность программы.
```

Explainer article:
```text
Менеджер подскажет, какие функции нужны вашему формату, а что лучше не закладывать.
```

### Gosha QA

Before preview, verify:
- first paragraph works as bold accent;
- second paragraph is short;
- handoff matches article logic;
- no contradiction between intro promise and Gosha handoff;
- no long venue/timing/budget checklist in Gosha.

## Visual-copy language

Visible media/visual blocks must be customer-facing. Do not write:
- “для этой статьи используем…”;
- “иллюстрация показывает…”;
- “это не фото…”;
- “редакционный образ выбран потому что…”.

Allowed internal provenance belongs only in `actualDescription`, not in visible title/description/caption.

## Metadata copy

### H1
- Human, scenario-based, tied to primary intent.
- No awkward exact-match stuffing.

### SEO title
Pattern:
```text
<primary scenario/query>: <customer benefit or decision> | КИБЕР ПОРТАЛ
```

### Meta description
- 1–2 sentences.
- Explain value, scenario and major robots/formats if relevant.
- No invented guarantees or unavailable facts.

### aiSummary
- Factual summary of article value.
- Must reflect the final article promise and manager/verification dependency when relevant.

## Article promise consistency

Before preview, verify:
```text
Hero lead = SEO intro = H2 structure = visual block = comparison/checklist = Gosha handoff = CTA
```

If an article names several robots/formats as a combined scenario, each must get a clear role or the article must explicitly narrow focus. Do not accidentally collapse a multi-robot promise into a single-role handoff.
