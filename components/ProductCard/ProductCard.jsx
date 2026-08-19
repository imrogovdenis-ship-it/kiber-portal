// Robot catalogue tile. Photo 4:3, radius 18, price in brand blue.
export function ProductCard({
  image, title, text, price, tag,
  href = '#',
  variant = 'outline', // 'outline' | 'tint' | 'dark'
}) {
  const cls = ['kp-card', variant === 'tint' ? 'kp-card--tint' : variant === 'dark' ? 'kp-card--dark' : 'kp-card--outline'].join(' ');
  return (
    <a href={href} className={cls} style={{ display: 'block', textDecoration: 'none' }}>
      {image && <img className="kp-card__media" src={image} alt={title} />}
      <div className={`kp-card__body${variant === 'dark' ? ' kp-on-dark' : ''}`}>
        {tag && <span className="kp-tag" style={{ alignSelf: 'flex-start' }}>{tag}</span>}
        <h3 className="kp-h3">{title}</h3>
        {text && <p className="kp-body">{text}</p>}
        {price && <p className="kp-stat" style={{ fontSize: 22, marginTop: 'var(--s-1)' }}>{price}</p>}
      </div>
    </a>
  );
}

export function ProductGrid({ children, columns = 3 }) {
  return (
    <section className="kp-section kp-section--tint">
      <div className="kp-container">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 'var(--s-5)' }}>
          {children}
        </div>
      </div>
    </section>
  );
}
