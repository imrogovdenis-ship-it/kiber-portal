// "Кибер Гоша" — the brand's expert voice. Appears 1–2 times per page on tint,
// right before the price block, to make a recommendation in first person.
export function ExpertQuote({
  text,
  name = 'Кибер Гоша',
  role = 'Ваш цифровой помощник',
  avatar = '/assets/kiber-gosha.png',
}) {
  return (
    <section className="kp-section kp-section--tint">
      <div className="kp-container">
        <div style={{ display: 'flex', gap: 'var(--s-5)', alignItems: 'flex-start', maxWidth: 900 }}>
          <img src={avatar} alt={name} style={{ width: 120, flex: '0 0 120px' }} />
          <div>
            <p className="kp-body" style={{ marginBottom: 'var(--s-4)' }}>{text}</p>
            <p style={{ fontSize: 14, lineHeight: 1.2, fontWeight: 600, color: 'var(--kp-gray)', margin: 0 }}>{name}</p>
            <p style={{ fontSize: 12, lineHeight: 1.2, fontWeight: 600, color: 'var(--kp-gray-light)', margin: '4px 0 0' }}>{role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
