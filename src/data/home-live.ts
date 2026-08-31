import source from '../../data/design/home-live-blocks.json';

export type HomeImage = { src: string; alt: string };
export type HomeLink = { label: string; href: string };
export type HomeGoshaData = { title: string; subtitle: string; text: string; image: HomeImage };
export type HomeCard = { title: string; description: string; href: string; cta?: string; image: HomeImage };
export type HomeCardsBlock = { title: string; description: string; cards: HomeCard[] };
export type HomeFaqData = { title: string; items: { question: string; answer: string }[] };
export type HomeFinalCtaData = { title: string; description: string; primaryCta: HomeLink; secondaryCta: HomeLink; image: HomeImage };

const imageMap: Record<string, string> = {
  '/images/tild3632-3236-4238-b335-623531393036__hi.png': '/images/home-live/tild3632-3236-4238-b335-623531393036-hi.webp',
  '/images/tild6236-3533-4337-a135-646431333264__01.jpg': '/images/home-live/tild6236-3533-4337-a135-646431333264-01.webp',
  '/images/tild3135-3762-4632-b339-363666636639__02.jpg': '/images/home-live/tild3135-3762-4632-b339-363666636639-02.webp',
  '/images/tild3865-6231-4930-b331-613466613565__03.jpg': '/images/home-live/tild3865-6231-4930-b331-613466613565-03.webp',
  '/images/tild6530-6334-4661-b732-376565343033__05.jpg': '/images/home-live/tild6530-6334-4661-b732-376565343033-05.webp',
  '/images/tild3938-3131-4561-b933-386466336139__04.jpg': '/images/home-live/tild3938-3131-4561-b933-386466336139-04.webp',
  '/images/tild3065-3664-4363-b561-616435326462__-__resize__504x______.jpg': '/images/home-live/tild3065-3664-4363-b561-616435326462---resize-504x.webp',
  '/images/tild6135-3630-4137-a364-616534393962___unitree_g1__agibot_.jpg': '/images/home-live/tild6135-3630-4137-a364-616534393962--unitree-g1-agibot.webp',
  '/images/tild6336-6531-4762-a632-626264336661_____0.jpg': '/images/home-live/tild6336-6531-4762-a632-626264336661---0.webp',
  '/images/tild3263-3466-4434-b366-643161663638__-__resize__504x_____.jpg': '/images/home-live/tild3263-3466-4434-b366-643161663638---resize-504x.webp',
  '/images/tild6632-3039-4435-b631-633138313135____________.jpg': '/images/home-live/tild6632-3039-4435-b631-633138313135.webp',
  '/images/tild6266-3534-4863-a462-636335633561___-______.jpg': '/images/home-live/tild6266-3534-4863-a462-636335633561.webp'
};

const routeFallbacks: Record<string, string> = {
  '/compilations#roboty-sobaki': '/roboty-sobaki/',
  '/arenda-robotov-na-meropriyatie': '/compilations/',
  '/sravnenie-unitree-g1-r1-h2': '/compilations/',
  '/neobychnyi-podarok-direktoru-robot': '/articles/',
  '/unitree-g1-ili-agibot-x2': '/articles/',
  '/pozdravlenie-robotom-na-svadbe': '/articles/',
  '/robot-ofitsiant-na-meropriyatii': '/articles/',
  '/velkom-zona-na-svadbe-robot': '/articles/',
};

function image(input: { src: string; alt: string }): HomeImage {
  return { src: imageMap[input.src] ?? input.src, alt: input.alt };
}

function href(input: string): string {
  return routeFallbacks[input] ?? input;
}

function card(input: { title: string; description: string; href: string; cta?: string; image: { src: string; alt: string } }): HomeCard {
  return { title: input.title, description: input.description, href: href(input.href), cta: input.cta, image: image(input.image) };
}

export const homeLiveOrder = source.homeOrder;
export const homeGosha: HomeGoshaData = {
  title: source.kiberGosha.title,
  subtitle: source.kiberGosha.subtitle,
  text: source.kiberGosha.text,
  image: image(source.kiberGosha.image),
};
export const homeCompilations: HomeCardsBlock = {
  title: source.compilations.title,
  description: source.compilations.description,
  cards: source.compilations.cards.map(card),
};
export const homeArticles: HomeCardsBlock = {
  title: source.articles.title,
  description: source.articles.description,
  cards: source.articles.cards.map(card),
};
export const homeFaq: HomeFaqData = source.faq;
export const homeFinalCta: HomeFinalCtaData = {
  title: source.finalCta.title,
  description: source.finalCta.description,
  primaryCta: { label: source.finalCta.primaryCta.label, href: '/contacts/' },
  secondaryCta: { label: source.finalCta.secondaryCta.label, href: '/#catalog' },
  image: image(source.finalCta.image),
};
