// Dark footer. Logo knocked out to white, links in gray-light.
export function Footer({
  logo = '/assets/logo.svg',
  phone = '+7 (495) 000-00-00',
  columns = [
    { title: 'Каталог', links: [{ label: 'Гуманоиды', href: '#' }, { label: 'Робо-собаки', href: '#' }, { label: 'Официанты', href: '#' }] },
    { title: 'Компания', links: [{ label: 'О нас', href: '#' }, { label: 'Доставка', href: '#' }, { label: 'Договор', href: '#' }] },
  ],
}) {
  return (
    <footer className="kp-section kp-section--dark kp-on-dark" style={{ paddingTop: 'var(--s-7)', paddingBottom: 'var(--s-7)' }}>
      <div className="kp-container" style={{ display: 'flex', gap: 'var(--s-7)', flexWrap: 'wrap' }}>
        <div style={{ flex: '0 0 200px' }}>
          <img src={logo} alt="Кибер Портал" style={{ width: 130, filter: 'brightness(0) invert(1)' }} />
        </div>

        {columns.map(col => (
          <div key={col.title}>
            <p className="kp-caption" style={{ marginBottom: 'var(--s-3)' }}>{col.title}</p>
            {col.links.map(l => (
              <a key={l.label} href={l.href} style={{
                display: 'block', marginBottom: 'var(--s-2)',
                color: 'var(--kp-gray-light)', textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
              }}>{l.label}</a>
            ))}
          </div>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="kp-h3" style={{ color: 'var(--kp-white)', textDecoration: 'none', display: 'block', marginBottom: 'var(--s-3)' }}>{phone}</a>
          <a href="#form" className="kp-btn kp-btn--primary kp-btn--sm">Заказать звонок</a>
        </div>
      </div>
    </footer>
  );
}
