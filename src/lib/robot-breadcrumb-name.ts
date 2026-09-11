import catalogTitles from '../../data/content/home-catalog-titles.json';

// Breadcrumb labels are nominative catalog identities, never fragments of rental H1s.
const kindPrefix: Record<string, string> = {
  'arenda-agibot-x2': 'Робот-гуманоид',
  'arenda-noetix-bumi': 'Робот-гуманоид',
  'arenda-unitree-g1': 'Робот-гуманоид',
  'arenda-unitree-r1': 'Робот-гуманоид',
  'arenda-unitree-h2': 'Робот-гуманоид',
  'arenda-unitree-go2': 'Робот-собака',
  'arenda-xiaomi-cyberdog-2': 'Робот-собака',
  'arenda-inchbot-l1-w-edu': 'Робот-собака',
  'arenda-promobot-v4': 'Робот',
  'arenda-sketchbot': 'Робот',
};

export function robotBreadcrumbName(slug: string): string {
  const title = catalogTitles[slug as keyof typeof catalogTitles];
  if (typeof title !== 'string' || !title.trim()) {
    throw new Error(`Missing nominative catalog identity for robot breadcrumb: ${slug}`);
  }
  const label = slug === 'arenda-xiaomi-cyberdog-2' ? title.replace('Cyberdog', 'CyberDog') : title;
  return kindPrefix[slug] && !/^Робот(?:\s|-)/u.test(label) ? `${kindPrefix[slug]} ${label}` : label;
}
