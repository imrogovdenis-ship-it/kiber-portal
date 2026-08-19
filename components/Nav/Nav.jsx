// Fixed white header. One primary action, never two.
export function Nav({ links = [], cta = { label: 'Написать нам', href: '#form' }, logo = '/assets/logo.svg' }) {
  const items = links.length ? links : [
    { label: 'Роботы', href: '#robots' },
    { label: 'Аренда', href: '#rent' },
    { label: 'Кейсы', href: '#cases' },
    { label: 'Контакты', href: '#contacts' },
  ];
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 990,
      height: 80, background: 'var(--kp-white)',
      borderBottom: '1px solid var(--kp-border)',
    }}>
      <div className="kp-container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 28 }}>
        <a href="/" style={{ display: 'flex', flex: '0 0 auto' }}>
          <img src={logo} alt="Кибер Портал" style={{ width: 100 }} />
        </a>
        <nav style={{ display: 'flex', gap: 24 }}>
          {items.map(i => (
            <a key={i.href} href={i.href} style={{
              color: 'var(--kp-ink-800)', textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
            }}>{i.label}</a>
          ))}
        </nav>
        <a href={cta.href} className="kp-btn kp-btn--primary kp-btn--sm" style={{ marginLeft: 'auto' }}>
          {cta.label}
        </a>
      </div>
    </header>
  );
}
