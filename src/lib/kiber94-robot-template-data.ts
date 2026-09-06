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

type OwnerRobotCardCopy = {
  capabilitiesLead: string;
  capabilities: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
  scenariosLead: string;
  scenarios: Array<Pick<RobotCardTextBlock, 'title' | 'text'>>;
};

const ownerAiSummaryBySlug: Record<string, string> = {
  'arenda-unitree-g1': 'Unitree G1 - гуманоидный робот для мероприятий, выставок, презентаций и шоу-программ. Его можно арендовать как интерактивного гостя, промо-персонажа или технологичный элемент стенда. Команда КИБЕР ПОРТАЛА помогает подобрать сценарий, доставляет робота на площадку и сопровождает его работу оператором.',
};

const ownerRobotCardCopyBySlug: Record<string, OwnerRobotCardCopy> = {
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
      title: robot.seo.title,
      description: robot.seo.description,
      canonical: robot.route,
      h1: `Аренда ${robot.identity.name}`,
      primaryKeyword: `аренда ${robot.identity.name}`,
      secondaryKeywords: [`прокат ${robot.identity.name}`, `${robot.identity.name} на мероприятие`],
    },
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
    faq: robot.faq.map((item) => ({ ...item, sourceStatus: 'page_content' as const })),
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
      gallery: [robot.media.hero, ...robot.media.gallery].filter(Boolean).map((image) => {
        const previewSrc = toPreviewAsset(image.src);
        return previewSrc ? { src: previewSrc, alt: image.alt, sourceStatus: 'page_content' as const } : undefined;
      }).filter((image): image is { src: string; alt: string; sourceStatus: 'page_content' } => Boolean(image)).slice(0, 8),
    },
  };
}
