(() => {
  const popup = document.querySelector('[data-lead-form-popup]');
  if (!popup) return;

  const panel = popup.querySelector('.contact-lead-popup__panel');
  const form = popup.querySelector('[data-lead-form-popup-form]');
  const status = popup.querySelector('[data-lead-form-popup-status]');
  const sourcePageInput = popup.querySelector('[data-lead-form-source-page]');
  const robotInput = popup.querySelector('[data-lead-form-robot]');
  const triggers = document.querySelectorAll('[data-lead-form-popup-trigger], a[href^="/lead/request"]');
  let previousFocus = null;

  const setStatus = (message) => { if (status) status.textContent = message || ''; };

  const openPopup = (event) => {
    if (event) event.preventDefault();
    const target = event?.currentTarget;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (sourcePageInput) sourcePageInput.value = window.location.pathname;
    if (robotInput && target instanceof HTMLAnchorElement) {
      const href = new URL(target.getAttribute('href') || '/lead/request/', window.location.origin);
      robotInput.value = href.searchParams.get('robot') || target.dataset.analyticsSlug || 'general';
    }
    popup.hidden = false;
    document.body.classList.add('contact-lead-popup-open');
    setStatus('');
    requestAnimationFrame(() => panel?.focus({ preventScroll: true }));
  };

  const closePopup = () => {
    popup.hidden = true;
    document.body.classList.remove('contact-lead-popup-open');
    previousFocus?.focus?.({ preventScroll: true });
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openPopup));
  popup.querySelectorAll('[data-lead-form-popup-close]').forEach((control) => control.addEventListener('click', closePopup));
  document.addEventListener('keydown', (event) => {
    if (!popup.hidden && event.key === 'Escape') closePopup();
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!(form instanceof HTMLFormElement)) return;
    if (!form.reportValidity()) return;
    const submit = form.querySelector('button[type="submit"]');
    submit?.setAttribute('disabled', 'disabled');
    setStatus('Отправляем заявку…');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { accept: 'application/json' },
      });
      if (response.ok || response.status === 202) {
        setStatus('Заявка отправлена. Спасибо!');
        window.location.href = '/lead/thanks/?request=preview';
        return;
      }
      setStatus('Не получилось отправить заявку. Попробуйте написать нам в мессенджер.');
    } catch (_error) {
      setStatus('Не получилось отправить заявку. Попробуйте написать нам в мессенджер.');
    } finally {
      submit?.removeAttribute('disabled');
    }
  });
})();
