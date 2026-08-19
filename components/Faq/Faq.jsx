// Price / FAQ accordion. On the live site this is where the "Сколько стоит аренда…"
// question always lands — it is the last thing before the footer CTA.
export function Faq({ title = 'Вопросы и ответы', items = [] }) {
  return (
    <section className="kp-section kp-section--tint">
      <div className="kp-container">
        <h2 className="kp-h2" style={{ marginBottom: 'var(--s-9)' }}>{title}</h2>
        <div style={{ borderTop: '1px solid var(--kp-border)' }}>
          {items.map((it, i) => (
            <details key={i} style={{ borderBottom: '1px solid var(--kp-border)' }}>
              <summary style={{
                listStyle: 'none', cursor: 'pointer',
                padding: 'var(--s-5) 0', display: 'flex',
                alignItems: 'center', justifyContent: 'space-between', gap: 'var(--s-4)',
                fontSize: 'var(--fs-h3)', lineHeight: 'var(--lh-h3)',
                fontWeight: 700, color: 'var(--kp-ink-800)',
              }}>
                {it.q}
                <span style={{ color: 'var(--kp-blue)', fontSize: 24, flex: '0 0 auto' }}>+</span>
              </summary>
              <p className="kp-body" style={{ paddingBottom: 'var(--s-5)', maxWidth: 760 }}>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
