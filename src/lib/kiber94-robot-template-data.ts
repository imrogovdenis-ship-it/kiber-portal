import type { RobotPageRecord } from './robot-pages';
import type { RobotCardTemplateData } from './page-type-templates';

export function toRobotCardTemplateData(robot: RobotPageRecord): RobotCardTemplateData {
  const priceStatus = robot.pricing.mode === 'calculated' ? 'request' : 'needs_review';
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
    aiSummary: `${robot.identity.name} — робот из каталога КИБЕР ПОРТАЛ для мероприятий. Preview-шаблон показывает реальные данные карточки: описание услуги, сценарии, медиа, цену в утверждённом статусе и заявку без публикации на production.`,
    hero: {
      id: 'hero',
      title: `Аренда ${robot.identity.name}`,
      text: robot.seo.description,
      items: [],
      sourceStatus: 'page_content',
    },
    bodyBlocks: [
      {
        id: 'description',
        title: 'Описание услуги',
        text: robot.service.venue_requirements.filter(Boolean).join(' ') || robot.seo.description,
        items: [],
        sourceStatus: 'page_content',
      },
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
      priceStatus,
      priceDisplay: robot.pricing.display,
      capabilities: capabilityBlocks,
      scenarios: scenarioBlocks,
      gallery: [robot.media.hero, ...robot.media.gallery].filter(Boolean).slice(0, 8).map((image) => ({
        src: image.src,
        alt: image.alt,
        sourceStatus: 'page_content' as const,
      })),
    },
  };
}
