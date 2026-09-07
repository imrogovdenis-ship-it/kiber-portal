import type { RobotPageRecord } from './robot-pages';
import type { RobotCardTemplateData } from './page-type-templates';

function toPreviewAsset(src: string): string | undefined {
  if (!src.startsWith('/')) return src;
  const publicAssets = import.meta.glob('/public/**/*', { eager: true, query: '?url', import: 'default' });
  if (publicAssets[`/public${src}`]) return src;
  const rawFilename = src.split('/').at(-1);
  const previewFilename = rawFilename?.replace(/\.(jpe?g|png)$/i, '.webp');
  const previewSrc = previewFilename ? `/images/kiber-94-preview/${previewFilename}` : undefined;
  return previewSrc && publicAssets[`/public${previewSrc}`] ? previewSrc : undefined;
}

type RobotCardTextBlock = RobotCardTemplateData['robot']['capabilities'][number];

type OwnerSeoOverride = {
  title: string;
  description: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
};

type OwnerSeoIntent = {
  pageType: 'robot_card';
  pageIntent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  modelNameVariants: string[];
  entitySynonyms: string[];
  aiAgentHints: string[];
  entity: { type: 'Robot'; name: string; model?: string; manufacturer?: string; category?: string; canonicalPath: string };
  isCrawlerOnlyText: false;
};

type OwnerFaqOverride = Array<{ question: string; answer: string }>;

type OwnerRobotCardCopy = {
  capabilitiesLead: string;
  capabilities: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
  scenariosLead: string;
  scenarios: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
};


const kettybotReviewGallery = [
  {
    'src': '/images/kiber-45/arenda-kettybot.webp',
    'alt': 'Робот-официант KettyBot: крупным планом везёт поднос на корпоративном мероприятии.'
  },
  {
    'src': '/images/kiber-94-preview/tild6236-3131-4466-a632-623038373139__07.webp',
    'alt': 'Робот-официант KettyBot: крупным планом везёт поднос на корпоративном мероприятии.'
  },
  {
    'src': '/images/kiber-94-preview/tild6139-3335-4138-a539-383539326630__01.webp',
    'alt': 'Робот-доставщик KettyBot, робот для ресторана KettyBot: едет вдоль столиков в кафе; на рекламном экране показаны изображения блюд. Горизонтальное фото.'
  },
  {
    'src': '/images/kiber-94-preview/tild6330-6138-4764-a335-376636333838__04.webp',
    'alt': 'Робот-промоутер с экраном KettyBot, интерактивный робот-официант KettyBot: везёт два блюда гостям конференции, вид сзади.'
  },
  {
    'src': '/images/kiber-94-preview/tild3762-3232-4237-b965-323533333164__09.webp',
    'alt': 'Заказать сервисного робота KettyBot на HoReCa-зоны и события с гостями: крупным планом едет по кафе; на заднем фоне столики и стулья.'
  },
  {
    'src': '/images/kiber-94-preview/tild3864-3062-4563-b431-666566303761__02.webp',
    'alt': 'Робот-официант KettyBot: стоит у фотозоны на выставке рядом с женщиной, которая смотрит на него и фотографируется с ним.'
  },
  {
    'src': '/images/kiber-94-preview/tild3736-3534-4030-b338-333366663735__06.webp',
    'alt': 'Арендовать робота-промоутера KettyBot для HoReCa-зоны и события с гостями: едет по ресторану; на экране отображаются изображения блюд.'
  },
  {
    'src': '/images/kiber-94-preview/tild6365-3064-4761-a334-303561393261__03.webp',
    'alt': 'Робот-доставщик KettyBot, робот для ресторана KettyBot: крупным планом в помещении кафе.'
  },
  {
    'src': '/images/kiber-94-preview/tild3938-3662-4534-b030-623936613139__05.webp',
    'alt': 'Взять в прокат сервисного робота KettyBot для HoReCa-зоны и события с гостями: Сервисный робот-официант KettyBot на корпоративном мероприятии позирует рядом с робобаром.'
  }
].map((image) => ({ ...image, sourceStatus: 'page_content' as const }));

const ownerSeoBySlug: Record<string, OwnerSeoOverride> = {
  'arenda-kettybot': {
    title: 'Аренда KettyBot — робот-официант для ресторана и мероприятия',
    description: 'Аренда KettyBot с доставкой, настройкой маршрутов, рекламным экраном и сопровождением для ресторана, банкета, отеля или выставки HoReCa.',
    h1: 'Аренда робота-официанта KettyBot',
    primaryKeyword: 'аренда KettyBot',
    secondaryKeywords: ['KettyBot аренда', 'робот-официант KettyBot', 'прокат KettyBot', 'заказать KettyBot', 'KettyBot для ресторана'],
  },
};

const ownerSeoIntentBySlug: Record<string, OwnerSeoIntent> = {
  'arenda-kettybot': {
    pageType: 'robot_card',
    pageIntent: 'commercial_robot_rental',
    primaryKeyword: 'аренда KettyBot',
    secondaryKeywords: ['KettyBot аренда', 'робот-официант KettyBot', 'прокат KettyBot', 'заказать KettyBot', 'KettyBot для ресторана'],
    modelNameVariants: ['KettyBot', 'Ketty Bot', 'Кеттибот', 'Кэтибот', 'робот KettyBot', 'Pudu KettyBot'],
    entitySynonyms: ['робот-официант', 'сервисный робот', 'робот-доставщик', 'робот для ресторана', 'робот для HoReCa'],
    aiAgentHints: [
      'Страница отвечает на коммерческий запрос аренды конкретной модели KettyBot.',
      'Generic запросы про аренду робота-официанта принадлежат подборке/сценарной странице, а не primaryKeyword этой карточки.',
      'Wordstat показал низкий exact-model спрос, но наличие выдачи и entity-запроса robot-waiter KettyBot подтверждает смысл exact-model карточки.',
      'Цена, маршрут, длительность, брендирование и условия площадки уточняются менеджером КИБЕР ПОРТАЛ.',
    ],
    entity: { type: 'Robot', name: 'KettyBot', model: 'KettyBot', manufacturer: 'Pudu Robotics', category: 'service_robot', canonicalPath: '/preview/kiber-94/robot-card/arenda-kettybot/' },
    isCrawlerOnlyText: false,
  },
};

const ownerFaqBySlug: Record<string, OwnerFaqOverride> = {
  'arenda-kettybot': [
    { question: 'Для каких мероприятий подходит KettyBot?', answer: 'KettyBot подходит для ресторанов, кафе, отелей, банкетов, фуршетов и выставочных зон HoReCa. Робот помогает доставлять блюда, напитки или промо-материалы по заранее настроенному маршруту и одновременно создаёт заметный технологичный сервис.' },
    { question: 'Сколько стоит аренда KettyBot?', answer: 'Стоимость зависит от даты, города, длительности аренды, маршрутов, брендирования экрана и необходимости операторского сопровождения. Менеджер КИБЕР ПОРТАЛ уточнит план зала, задачу робота и подготовит расчёт под ваш формат.' },
    { question: 'Нужен ли оператор для робота-официанта?', answer: 'Для мероприятия мы рекомендуем сопровождение: оператор помогает настроить маршрут, проверить проходы, объяснить персоналу загрузку подносов и быстро решить вопросы на площадке.' },
    { question: 'Какие требования к площадке?', answer: 'Нужен ровный сухой пол, достаточная ширина проходов, понятные точки остановки и стабильная зона движения без высоких порогов. Перед запуском команда проверяет маршрут и расстановку мебели.' },
    { question: 'Можно ли использовать KettyBot как рекламный экран?', answer: 'Да, экран робота можно использовать для приветствий, акций, меню, логотипа или коротких брендированных сообщений. Материалы и сценарий показа лучше согласовать заранее, чтобы реклама не мешала сервисной задаче.' },
  ],
};

const ownerAiSummaryBySlug: Record<string, string> = {
  'arenda-kettybot': 'KettyBot — робот-официант для ресторанов, банкетов, отелей и выставочных зон HoReCa. Его берут, когда нужно эффектно доставлять блюда, напитки или промо-материалы, разгрузить персонал на маршрутах и показать гостям технологичный сервис. КИБЕР ПОРТАЛ настраивает точки остановки, проверяет проходы и сопровождает запуск оператором.',
  'arenda-unitree-g1': 'Unitree G1 - гуманоидный робот для мероприятий, выставок, презентаций и шоу-программ. Его можно арендовать как интерактивного гостя, промо-персонажа или технологичный элемент стенда. Команда КИБЕР ПОРТАЛА помогает подобрать сценарий, доставляет робота на площадку и сопровождает его работу оператором.',
};

const ownerRobotCardCopyBySlug: Record<string, OwnerRobotCardCopy> = {

  'arenda-kettybot': {
    capabilitiesLead: 'KettyBot — робот-официант для залов, где важно совместить практичную доставку и вау-эффект. Здесь объясняем именно модель KettyBot: маршруты по залу, рекламный экран, подносы, помощь персоналу и операторский запуск на площадке.',
    capabilities: [
      { title: 'Доставка блюд и напитков', text: 'KettyBot перевозит блюда, напитки, дегустационные наборы или промо-материалы по заранее настроенному маршруту между кухней, залом и точками выдачи.' },
      { title: 'Работа по маршрутам', text: 'Перед запуском команда настраивает точки остановки и проверяет проходы, чтобы робот двигался предсказуемо и не мешал гостям или персоналу.' },
      { title: 'Рекламный экран', text: 'Экран можно использовать для приветствий, акций, меню, логотипа или коротких брендированных сообщений — полезно для HoReCa, выставок и промо-зон.' },
      { title: 'Сервисный вау-эффект', text: 'Гости замечают робота в зале, фотографируют подачу и охотнее обсуждают формат обслуживания — это работает как мягкий промо-инструмент.' },
      { title: 'Помощь персоналу', text: 'Робот не заменяет команду зала, а берёт на себя часть перемещений с подносами, чтобы официанты больше общались с гостями и контролировали сервис.' },
      { title: 'Сопровождение запуска', text: 'Оператор помогает настроить маршрут, объяснить персоналу сценарий работы, проверить покрытие и адаптировать робота под реальную расстановку столов.' },
    ],
    scenariosLead: 'KettyBot лучше всего раскрывается в живом сервисе: там, где есть маршруты, гости, подача и понятная задача для робота. Мы заранее проверяем зал, проходы, точки остановки и роль оператора, чтобы робот выглядел как часть сервиса, а не как препятствие на банкете.',
    scenarios: [
      { title: 'Ресторан и кафе', text: 'KettyBot помогает доставлять блюда и напитки между кухней, зоной выдачи и столами, пока официанты занимаются гостями и заказами.' },
      { title: 'Отель и гостиница', text: 'Робот подходит для завтраков, конференц-зон, welcome-сценариев и демонстрации технологичного сервиса для гостей отеля.' },
      { title: 'Банкет и фуршет', text: 'На банкете робот эффектно развозит закуски, напитки или промо-наборы между зонами и становится заметным поводом для фото.' },
      { title: 'Выставка HoReCa', text: 'На отраслевом стенде KettyBot показывает, как сервисная робототехника выглядит в реальном зале, а не только на презентационном баннере.' },
      { title: 'Открытие ресторана', text: 'Робот усиливает первое впечатление от заведения: встречает гостей, поддерживает подачу и помогает сделать открытие запоминающимся.' },
      { title: 'Промо-акция бренда', text: 'KettyBot можно использовать для брендированной подачи дегустаций, листовок или подарков, если заранее согласовать маршрут и загрузку.' },
    ],
  },

  'arenda-unitree-g1': {
    capabilitiesLead: 'Ключевые возможности Unitree G1 показывают, за что его берут на мероприятия: он двигается как гуманоид, поддерживает живое внимание гостей, помогает делать фото- и видеоконтент и остаётся управляемым элементом программы. Мы описываем только сценарные преимущества, которые команда может подготовить и сопровождать на площадке.',
    capabilities: [
      { title: 'Рост и вес', text: 'Рост и пластика гуманоидного корпуса помогают Unitree G1 выглядеть как живой герой стенда или сцены, а не как обычная техника для демонстрации.' },
      { title: 'Степени свободы', text: 'Множество степеней свободы позволяет роботу махать рукой, менять позы, двигаться в кадре и поддерживать короткие интерактивные моменты с гостями.' },
      { title: 'Автономность работы', text: 'Автономность работы помогает использовать Unitree G1 в шоу-блоках, промо-зонах и фотосессиях без постоянной паузы на ручную перенастройку.' },
      { title: 'Скорость передвижения', text: 'Скорость передвижения достаточно заметна для вау-эффекта, но сценарий подбирается с учётом безопасности, покрытия и плотности гостей.' },
      { title: 'Голосовое общение', text: 'Голосовое общение делает робота понятным участником программы: он может приветствовать гостей и поддерживать заданный промо-сценарий.' },
      { title: 'Компактность', text: 'Компактный корпус удобно перевозить и выводить на площадку: робот подходит для стендов, залов, шоурумов и событий с ограниченным пространством.' },
    ],
    scenariosLead: 'Сценарии использования помогают быстро понять, где Unitree G1 даст лучший эффект: на выставке, презентации, корпоративе, открытии площадки или в брендированной фотозоне. Для каждого события команда заранее проверяет маршрут робота, плотность гостей, длительность выхода и роль оператора, чтобы шоу выглядело уверенно и безопасно.',
    scenarios: [
      { title: 'Интерактивная фотозона', text: 'Интерактивная фотозона превращает Unitree G1 в героя кадров: гости подходят к роботу, здороваются, снимают короткие видео и получают заметный повод поделиться контентом после события.' },
      { title: 'Открытие бизнес-центра или шоурума', text: 'На открытии бизнес-центра или шоурума робот встречает посетителей, привлекает внимание к входной зоне, помогает показать технологичность пространства и создаёт понятный повод для фото гостей.' },
      { title: 'Презентация продукта или бренда', text: 'Во время презентации продукта или бренда Unitree G1 выходит в заданный момент, поддерживает демонстрацию, становится живым символом технологичности и усиливает запоминаемость запуска.' },
      { title: 'Корпоратив и деловое мероприятие', text: 'На корпоративе и деловом мероприятии робот работает как аккуратный вау-элемент: встречает гостей, появляется в перерывах, участвует в фото и сохраняет деловую атмосферу события без лишнего шума.' },
      { title: 'Технологическая выставка или конференция', text: 'На технологической выставке или конференции Unitree G1 помогает стенду выделиться в потоке посетителей: движение, позы и короткое общение быстро собирают внимание вокруг экспозиции.' },
      { title: 'Съёмка видео и создание контента для соцсетей', text: 'Для съёмки видео и создания контента для соцсетей робот даёт динамичный визуальный объект: его можно включить в ролик, backstage, промо-анонс или серию коротких клипов бренда после мероприятия.' },
    ],
  },
};

export function toRobotCardTemplateData(robot: RobotPageRecord): RobotCardTemplateData {
  const priceStatus = robot.pricing.mode === 'calculated' ? 'request' : 'needs_review';
  const ownerCopy = ownerRobotCardCopyBySlug[robot.slug];
  const ownerSeo = ownerSeoBySlug[robot.slug];
  const ownerSeoIntent = ownerSeoIntentBySlug[robot.slug];
  const ownerFaq = ownerFaqBySlug[robot.slug];
  const scenarioBlocks = robot.service.scenarios.map((scenario, index) => ({
    id: `scenario-${index + 1}`,
    title: scenario,
    text: scenario,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const capabilityBlocks = robot.facts.map((fact, index) => ({
    id: `capability-${index + 1}`,
    title: fact,
    text: fact,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const ownerCapabilityBlocks = ownerCopy?.capabilities.map((capability, index) => ({
    id: `capability-${index + 1}`,
    title: capability.title,
    text: capability.text,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const ownerScenarioBlocks = ownerCopy?.scenarios.map((scenario, index) => ({
    id: `scenario-${index + 1}`,
    title: scenario.title,
    text: scenario.text,
    items: [],
    sourceStatus: 'page_content' as const,
  }));
  const limitationBlocks = robot.service.limitations.map((limitation, index) => ({
    id: `limitation-${index + 1}`,
    title: index === 0 ? 'Ограничения и подтверждение' : undefined,
    text: limitation,
    items: [],
    sourceStatus: 'page_content' as const,
  }));

  return {
    pageType: 'robot_card',
    status: 'draft_for_owner_review',
    seo: {
      title: ownerSeo?.title ?? robot.seo.title,
      description: ownerSeo?.description ?? robot.seo.description,
      canonical: robot.route,
      h1: ownerSeo?.h1 ?? `Аренда ${robot.identity.name}`,
      primaryKeyword: ownerSeo?.primaryKeyword ?? `аренда ${robot.identity.name}`,
      secondaryKeywords: ownerSeo?.secondaryKeywords ?? [`прокат ${robot.identity.name}`, `${robot.identity.name} на мероприятие`],
    },
    seoIntent: ownerSeoIntent,
    aiSummary: ownerAiSummaryBySlug[robot.slug] ?? `${robot.identity.name} — робот из каталога КИБЕР ПОРТАЛ для мероприятий. Preview-шаблон показывает реальные данные карточки: описание услуги, сценарии, медиа, цену в утверждённом статусе и заявку без публикации на production.`,
    hero: {
      id: 'hero',
      title: `Аренда ${robot.identity.name}`,
      text: robot.seo.description,
      items: [],
      sourceStatus: 'page_content',
    },
    bodyBlocks: [
      ...(ownerCopy ? [
        {
          id: 'capabilitiesLead',
          text: ownerCopy.capabilitiesLead,
          items: [],
          sourceStatus: 'page_content' as const,
        },
        {
          id: 'scenariosLead',
          text: ownerCopy.scenariosLead,
          items: [],
          sourceStatus: 'page_content' as const,
        },
      ] : []),
      ...limitationBlocks,
    ],
    cta: {
      label: 'Обсудить сценарий с менеджером',
      href: `/lead/request/?robot=${robot.slug}&source=kiber94-preview`,
      note: 'Финальная программа, площадка, доступность и стоимость подтверждаются менеджером КИБЕР ПОРТАЛ.',
    },
    faq: (ownerFaq ?? robot.faq).map((item) => ({ ...item, sourceStatus: 'page_content' as const })),
    reviewOnly: {
      publicRender: false,
      blocks: ['priceSourceReconciliation', 'claimSourceStatus', 'wordstatAnalysis', 'serpAnalysis', 'sourceNotes'],
      notes: [
        'Preview route only: data is mapped from src/content/robots.generated.json.',
        'Public replacement of /robots/[slug]/ requires separate visual/content approval.',
      ],
    },
    robot: {
      name: robot.identity.name,
      manufacturer: robot.identity.manufacturer,
      model: robot.identity.model,
      category: robot.category,
      priceStatus,
      priceDisplay: robot.pricing.display,
      capabilities: ownerCapabilityBlocks ?? capabilityBlocks,
      scenarios: ownerScenarioBlocks ?? scenarioBlocks,
      gallery: robot.slug === 'arenda-kettybot'
        ? kettybotReviewGallery
        : [robot.media.hero, ...robot.media.gallery].filter(Boolean).map((image) => {
          const previewSrc = toPreviewAsset(image.src);
          return previewSrc ? { src: previewSrc, alt: image.alt, sourceStatus: 'page_content' as const } : undefined;
        }).filter((image): image is { src: string; alt: string; sourceStatus: 'page_content' } => Boolean(image)).slice(0, 8),
    },
  };
}
