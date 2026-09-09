import { homeArticles, homeCompilations, homeGosha, homeRobotCardFinalCta, type HomeCardsBlock, type HomeFinalCtaData, type HomeGoshaData } from '../data/home-live';
import type { Breadcrumb } from './seo';

export type ArticleBlockVariant = {
  id: string;
  label: string;
  title: string;
  purpose: string;
  sourceExamples: string[];
  required: 'mandatory' | 'optional';
  comment?: string;
};

export type ArticleRobotCard = {
  slug: string;
  href: string;
  title: string;
  category: string;
  price: string;
  price_disclaimer: 'Не является публичной офертой';
  description: string;
  badge?: string;
  image?: { src: string; alt: string };
  analytics: { event: 'robot_card_click'; placement: 'article'; position: number };
};


export type ArticleContent = {
  showInventory?: boolean;
  goshaPosition?: 'afterPlainText' | 'afterNumberedUseCases';
  seoIntro?: { eyebrow?: string; title: string; paragraphs: string[] };
  plainText?: { title: string; paragraphs: string[] };
  mediaMoment?: { eyebrow?: string; title: string; description: string; image: { src: string; alt: string }; caption?: string };
  gallery?: { eyebrow?: string; title: string; description: string; sliderId?: string; images?: { src: string; alt: string; title?: string }[] };
  comparison?: {
    eyebrow?: string;
    title: string;
    description: string;
    columns: { title: string; paragraphs: string[] }[];
    table?: { headers: string[]; rows: string[][]; note?: string };
  };
  obviousChoice?: { eyebrow?: string; title: string; cards: { number: string; title: string; text: string }[] };
  numberedUseCases?: { eyebrow?: string; title: string; description: string; items: { number: string; title: string; text: string }[] };
  checklist?: { eyebrow?: string; title: string; description: string; items: { title: string; text: string }[] };
  pairedEnumeration?: { eyebrow?: string; title: string; description: string; items: { title: string; text: string }[] };
  product?: { eyebrow?: string; title: string; featuredSlug?: string; featuredSlugs?: string[]; hideBadges?: boolean };
  catalog?: { eyebrow?: string; title: string; description: string; slugs?: string[]; hideBadges?: boolean };
  relatedArticles?: { eyebrow?: string; title: string; description: string };
  relatedCompilations?: { eyebrow?: string; title: string; description: string };
};

export type ArticleBlocksTemplateData = {
  seo: {
    title: string;
    description: string;
    canonical: string;
    h1: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
  };
  breadcrumbs: Breadcrumb[];
  blockVariants: ArticleBlockVariant[];
  hero: { eyebrow: string; lead: string; image: { src: string; alt: string; actualDescription?: string }; imageAlign?: 'right' | 'center' };
  aiSummary: string;
  gosha: HomeGoshaData;
  finalCta: HomeFinalCtaData;
  relatedArticles: HomeCardsBlock;
  relatedCompilations: HomeCardsBlock;
  robots: ArticleRobotCard[];
  faq: { title: string; items: { question: string; answer: string }[] };
  articleContent?: ArticleContent;
};

export function buildArticleBlocksTemplate(robots: ArticleRobotCard[]): ArticleBlocksTemplateData {
  return {
    seo: {
      title: 'Шаблон статьи КИБЕР ПОРТАЛ — инвентарь блоков Блога Кибер Гоши',
      description: 'Инвентарь обязательных и опциональных блоков статьи: hero, SEO-ввод, Кибер Гоша, сравнения, сценарии, чек-листы, каталог, FAQ и CTA.',
      canonical: '/preview/kiber-94/article-blocks/',
      h1: 'Шаблон статьи: все блоки для Блога Кибер Гоши',
      primaryKeyword: 'аренда роботов на мероприятие',
      secondaryKeywords: ['робот в подарок директору', 'Unitree G1 или Agibot X2', 'сравнение роботов-гуманоидов', 'как выбрать робота на мероприятие'],
    },
    breadcrumbs: [
      { name: 'Главная', url: '/' },
      { name: 'Блог Кибер Гоши', url: '/articles/' },
      { name: 'Шаблон статьи', url: '/preview/kiber-94/article-blocks/' },
    ],
    blockVariants: [
      { id: 'hero', label: '01', title: 'Hero статьи', required: 'mandatory', purpose: 'Тёмный первый экран: H1 + короткое обещание пользы.', comment: 'Обязательный старт после Header и крошек; размер H1 — как на утверждённой главной.', sourceExamples: ['все 4 live-статьи'] },
      { id: 'seoIntro', label: '02', title: 'SEO-ввод / затравка', required: 'mandatory', purpose: 'Один текстовый блок на всю ширину контейнера: AI-summary как вводный смысл статьи.', comment: 'Обязательный первый смысловой блок после Hero; без отдельной боковой SEO-плашки.', sourceExamples: ['Подарок директору', 'Аренда роботов на мероприятие'] },
      { id: 'plainText', label: '03', title: 'Простой текстовый блок с заголовком', required: 'mandatory', purpose: 'Классический H2 + 2–3 абзаца без карточек: объяснение процесса, условий или практического сценария.', comment: 'Обязателен после intro вместе с цитатой Гоши; точное место может меняться по логике статьи.', sourceExamples: ['Подарок директору', 'Аренда роботов на мероприятие'] },
      { id: 'goshaQuote', label: '04', title: 'Цитата Кибер Гоши', required: 'mandatory', purpose: 'Фирменный голос сайта: честный совет, пояснение или мостик к следующему блоку.', comment: 'Обязательный бренд-блок; текст меняется под тему статьи.', sourceExamples: ['Подарок директору', 'G1 vs Agibot', 'Аренда роботов'] },
      { id: 'mediaMoment', label: '05', title: 'Момент / фото / видео', required: 'optional', purpose: 'Визуальная пауза: горизонтальный 16:9 кадр или видео после объяснения.', comment: 'Добавлять, когда есть сильный фото- или видео-момент; не вставлять ради заполнения.', sourceExamples: ['Подарок директору', 'Роботы-гуманоиды'] },
      { id: 'robotCardGallery', label: '06', title: 'Галерея', required: 'optional', purpose: 'Горизонтальный drag-слайдер из утверждённой страницы-подборки, с заменяемыми фотографиями.', comment: 'Нужна для визуальных тем и сравнений; использовать реальных роботов/сцены, не generic картинки.', sourceExamples: ['Подборка / роботы-гуманоиды PR8'] },
      { id: 'comparisonBlock', label: '07', title: 'Сравнение', required: 'optional', purpose: 'Две модели или два подхода в текстовых колонках: кому что подходит.', comment: 'Ставить только в статьях, где пользователь реально выбирает между вариантами.', sourceExamples: ['Unitree G1 или Agibot X2', 'G1/R1/H2'] },
      { id: 'obviousChoice', label: '08', title: 'Три сценария, где выбор очевиден', required: 'optional', purpose: 'Три быстрых выбора с карточками в стиле «Гид по выбору».', comment: 'Подходит для развилок по сценариям мероприятия; не обязателен для коротких информационных статей.', sourceExamples: ['G1 vs Agibot', 'Подборка / роботы-гуманоиды'] },
      { id: 'numberedUseCases', label: '09', title: 'Форматы, где робот раскрывается лучше всего', required: 'optional', purpose: 'Нумерованный список сценариев с синими кругами и короткими пояснениями.', comment: 'Использовать для статей-гайдов и сценарных подборов.', sourceExamples: ['Аренда роботов на мероприятие'] },
      { id: 'checkpointList', label: '10', title: 'Чек-лист / требования', required: 'optional', purpose: 'Практичный блок перед заявкой: формат внимания, аудитория, длительность, площадка.', comment: 'Хорош перед CTA, если статья помогает подготовиться к заказу.', sourceExamples: ['Аренда роботов', 'G1/R1/H2'] },
      { id: 'pairedEnumeration', label: '11', title: 'Перечисление вариантов', required: 'optional', purpose: 'Двухколоночное перечисление привычных форматов и коротких пояснений.', comment: 'Заменяет длинный список, когда нужно быстро разложить несколько вариантов.', sourceExamples: ['event-статьи'] },
      { id: 'productCard', label: '12', title: 'Одна рекомендованная модель', required: 'optional', purpose: 'Крупный editorial-блок с одной моделью, фото, ценой, описанием и CTA.', comment: 'Можно использовать несколько раз в сравнениях; не обязателен, если статья не рекомендует конкретную модель.', sourceExamples: ['Подарок директору'] },
      { id: 'faq', label: '13', title: 'FAQ', required: 'mandatory', purpose: 'FAQPage-compatible ответы под long-tail вопросы и сниппеты.', comment: 'Обязательное начало финального хвоста статьи.', sourceExamples: ['все 4 live-статьи'] },
      { id: 'cta2', label: '14', title: 'CTA 2', required: 'mandatory', purpose: 'Утверждённый финальный CTA-блок с главной для заявки или консультации.', comment: 'Идёт сразу после FAQ; стиль не менять, только текст/данные по необходимости.', sourceExamples: ['Главная PR8'] },
      { id: 'catalogBlock', label: '15', title: 'Каталог роботов', required: 'mandatory', purpose: 'Утверждённый блок каталога с главной: 4 карточки в ряд на desktop.', comment: 'Обязательный блок моделей по смыслу статьи; карточки подбирать тематически.', sourceExamples: ['Главная PR8'] },
      { id: 'relatedArticles', label: '16', title: 'Статьи / Блог Кибер Гоши', required: 'mandatory', purpose: 'Связь статьи с другими подходящими статьями через утверждённый HomeImageCards.', comment: 'Обязательная внутренняя перелинковка на материалы блога по теме.', sourceExamples: ['Главная PR8'] },
      { id: 'relatedCompilations', label: '17', title: 'Подборки', required: 'mandatory', purpose: 'Тематические подборки по смыслу статьи через утверждённый HomeImageCards.', comment: 'Финальный блок хвоста; наполнение подбирать по теме, исключение фиксировать отдельно, если релевантных подборок нет.', sourceExamples: ['Главная PR8'] },
    ],
    hero: {
      eyebrow: 'Блог Кибер Гоши / article blocks',
      lead: 'Собрал одно длинное полотно, где подряд показаны все типы блоков, которые встречаются в старых статьях: от обычной SEO-затравки до сравнительных таблиц, чек-листов, сценариев, карточек роботов, FAQ и CTA.',
      image: { src: 'https://static.tildacdn.com/tild6135-3630-4137-a364-616534393962/_Unitree_G1__Agibot_.jpg', alt: 'роботы-гуманоиды Unitree G1 и Agibot X2 для статьи-сравнения' },
    },
    aiSummary: 'Шаблон статьи должен быть гибридом: визуально он следует текущей PR8-системе, структурно сохраняет блоки live-статей, а SEO/AI слой делает каждый блок осмысленным для поисковиков, сниппетов, LLM-ответов и внутренней перелинковки.',
    gosha: {
      ...homeGosha,
      text: '— Я разобрал старые статьи и вижу, что Блог Кибер Гоши работает лучше, когда статья не выглядит как длинная простыня текста. Нужны паузы: честный вывод, таблица, сценарии, чек-лист, карточки роботов и короткий совет от меня.\n\nНа этой странице блоки собраны вместе: обязательные задают скелет каждой статьи, а опциональные подключаются только тогда, когда помогают раскрыть тему.',
    },
    finalCta: homeRobotCardFinalCta,
    relatedArticles: homeArticles,
    relatedCompilations: homeCompilations,
    robots,
    faq: {
      title: 'FAQ для шаблона статьи',
      items: [
        { question: 'Какие блоки обязательны для каждой статьи?', answer: 'Базовый скелет: Hero, SEO / AI intro, простой текстовый блок с заголовком, цитата Кибер Гоши, FAQ, CTA2, Каталог роботов, Блог Кибер Гоши и Подборки. Наполнение хвостовых блоков подбирается по теме статьи.' },
        { question: 'Какие блоки можно добавлять по ситуации?', answer: 'Фото или видео-момент, галерея, сравнение, сценарии выбора, форматы использования, чек-лист, перечисление вариантов и одна рекомендованная модель. Они нужны не в каждой статье, а только когда усиливают смысл.' },
        { question: 'Можно ли менять порядок блоков?', answer: 'Старт статьи фиксированный: Hero → SEO / AI intro. После intro обязательны цитата Гоши и простой текстовый блок, но их место может меняться по логике. Финальный хвост фиксирован: FAQ → CTA2 → Каталог роботов → Блог Кибер Гоши → Подборки.' },
      ],
    },
  };
}
