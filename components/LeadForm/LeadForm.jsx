// Lead capture. Four fields is the ceiling — the live site never asks for more.
export function LeadForm({
  title = 'Оставьте заявку',
  text = 'Наши менеджеры свяжутся с вами в ближайшее время',
  submitLabel = 'Отправить',
  onSubmit,
  dark = false,
}) {
  return (
    <section className={`kp-section${dark ? ' kp-section--dark' : ' kp-section--tint'}`}>
      <div className="kp-container" style={{ maxWidth: 720 }}>
        <div className={dark ? 'kp-on-dark' : undefined} style={{ marginBottom: 'var(--s-5)' }}>
          <h2 className="kp-h2" style={{ marginBottom: 'var(--s-2)' }}>{title}</h2>
          <p className="kp-body">{text}</p>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 'var(--s-2)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-2)' }}>
            <input className="kp-input" name="name" placeholder="Имя" required />
            <input className="kp-input" name="phone" type="tel" placeholder="+7 (___) ___-__-__" required />
          </div>
          <input className="kp-input" name="email" type="email" placeholder="E-mail" />
          <textarea className="kp-input" name="comment" placeholder="Расскажите о мероприятии" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-4)', flexWrap: 'wrap', marginTop: 'var(--s-2)' }}>
            <button type="submit" className="kp-btn kp-btn--primary kp-btn--md">{submitLabel}</button>
            <p style={{ fontSize: 12, color: 'var(--kp-gray-light)', margin: 0, maxWidth: 360 }}>
              Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
