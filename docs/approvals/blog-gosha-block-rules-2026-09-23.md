# Blog Gosha block rules — owner rule recorded

- Block is used only on homepage, article detail pages, and compilation pages.
- Robot cards and other page types do not render the block.
- Exactly 6 cards: 5 real existing articles + final «Все статьи Блога Кибер Гоши» linking to /articles/.
- Article cards use canonical article-card data tied to article registry/runtime source; never invent non-existing/page-local article cards.
- Homepage block is final content block before footer; article and compilation pages place Blog Gosha immediately before closing «Подборки».
- Current HomeImageCards variant=article styling is the visual standard; do not redesign without owner instruction.
- Run npm run test:blog-gosha-blocks before publication/readiness handoff.

Production approved: false.
