import articles from '../../data/content/launch-articles.json';
import { homeArticles, homeCompilations, type HomeCardsBlock } from '../data/home-live';
import { reviewLinksAreEnabled } from './review-links';
export const launchArticles: HomeCardsBlock = { ...homeArticles, cards: articles.map(a => ({ title: a.title, description: a.description, image: a.image, href: reviewLinksAreEnabled ? a.href : a.canonicalHref })) };
export const launchCompilations: HomeCardsBlock = { ...homeCompilations, cards: homeCompilations.cards.map((card,index) => {
 const ready = /Совсем как люди/i.test(card.title);
 const hub = /Все.*подборки/i.test(card.title);
 return { ...card, originalHref: undefined, href: ready ? (reviewLinksAreEnabled ? '/preview/kiber-94/compilation/roboty-gumanoidy/' : '/roboty-gumanoidy/') : hub ? '/compilations/' : '', disabled: !ready && !hub, cta: !ready && !hub ? 'Скоро' : card.cta };
}) };
