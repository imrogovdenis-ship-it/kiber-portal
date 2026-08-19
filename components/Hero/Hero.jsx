// Full-bleed photo cover with the ink scrim. The only place H1 lives.
export function Hero({
  eyebrow = 'МОСКВА — ВЫЕЗД ПО ВСЕЙ РОССИИ',
  title = 'Аренда робота-официанта',
  text = 'Разносит напитки, работает по вашему сценарию, собирает очередь из гостей.',
  image = '/assets/hero-cover.jpg',
  primary = { label: 'Рассчитать стоимость', href: '#form' },
  secondary = { label: 'Смотреть роботов', href: '#robots' },
  height = '50vh',
}) {
  return (
    <section className="kp-on-dark" style={{ position: 'relative', minHeight: height, background: 'var(--kp-ink-900)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `url(${image}) center/cover` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'var(--kp-scrim-hero)' }} />
      <div className="kp-container" style={{
        position: 'relative', minHeight: height,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        gap: 'var(--s-3)', paddingTop: 'var(--s-10)', paddingBottom: 'var(--s-8)',
      }}>
        <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}>
          {eyebrow && <span className="kp-caption">{eyebrow}</span>}
          <h1 className="kp-display">{title}</h1>
          {text && <p className="kp-lead">{text}</p>}
          <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap', marginTop: 'var(--s-2)' }}>
            {primary && <a href={primary.href} className="kp-btn kp-btn--primary kp-btn--md">{primary.label}</a>}
            {secondary && <a href={secondary.href} className="kp-btn kp-btn--ghost kp-btn--md">{secondary.label}</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
