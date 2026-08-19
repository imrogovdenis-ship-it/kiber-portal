// "Что входит" / "Почему мы" section — icon bullets plus an optional stats row.
export function FeatureGrid({
  title = 'Что входит в аренду',
  features = [],
  stats = [],
  tint = true,
}) {
  return (
    <section className={`kp-section${tint ? ' kp-section--tint' : ''}`}>
      <div className="kp-container">
        {title && <h2 className="kp-h2" style={{ marginBottom: 'var(--s-6)' }}>{title}</h2>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-5)' }}>
          {features.map(f => (
            <div key={f.title}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--r-pill)',
                background: tint ? 'var(--kp-white)' : 'var(--kp-blue-tint)',
                display: 'grid', placeItems: 'center', marginBottom: 'var(--s-3)',
                color: 'var(--kp-blue)',
              }}>{f.icon}</div>
              <h3 className="kp-h3" style={{ marginBottom: 'var(--s-2)' }}>{f.title}</h3>
              <p className="kp-body">{f.text}</p>
            </div>
          ))}
        </div>

        {stats.length > 0 && (
          <div style={{
            display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 'var(--s-5)', marginTop: 'var(--s-8)',
            paddingTop: 'var(--s-6)', borderTop: '1px solid var(--kp-border)',
          }}>
            {stats.map(s => (
              <div key={s.label}>
                <p className="kp-stat">{s.value}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--kp-gray)', marginTop: 'var(--s-1)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
