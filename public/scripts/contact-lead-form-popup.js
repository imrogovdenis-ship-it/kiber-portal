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
  let submitting = false;
  let accepted = false;
  const backgroundState = new Map();
  const focusable = () => [...panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]')]
    .filter((element) => element.tabIndex >= 0 && !element.hidden && element.getClientRects().length);


  const failureMessage = 'Не получилось отправить заявку. Попробуйте написать нам в мессенджер.';
  const setStatus = (message) => { if (status) status.textContent = message || ''; };

  const openPopup = (event) => {
    if (event) event.preventDefault();
    const target = event?.currentTarget;
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (sourcePageInput) sourcePageInput.value = window.location.pathname;
    if (robotInput && target instanceof HTMLAnchorElement) {
      const href = new URL(target.getAttribute('href') || '/lead/request/', window.location.origin);
      const pageRobot = window.location.pathname.match(/^\/robots\/(arenda-[a-z0-9-]+)\/?$/)?.[1];
      const requestedRobot = window.location.pathname.startsWith('/lead/request') ? new URLSearchParams(window.location.search).get('robot') : null;
      robotInput.value = pageRobot || (requestedRobot && /^arenda-[a-z0-9-]+$/.test(requestedRobot) ? requestedRobot : null) || href.searchParams.get('robot') || 'general';
    }
    popup.hidden = false;
    for (const element of document.body.children) {
      if (element instanceof HTMLElement && element !== popup && !element.contains(popup)) {
        backgroundState.set(element, element.inert);
        element.inert = true;
      }
    }
    document.body.classList.add('contact-lead-popup-open');
    setStatus('');
    requestAnimationFrame(() => panel?.focus({ preventScroll: true }));
  };

  const closePopup = () => {
    popup.hidden = true;
    for (const [element, inert] of backgroundState) element.inert = inert;
    backgroundState.clear();
    document.body.classList.remove('contact-lead-popup-open');
    previousFocus?.focus?.({ preventScroll: true });
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openPopup));
  popup.querySelectorAll('[data-lead-form-popup-close]').forEach((control) => control.addEventListener('click', closePopup));
  document.addEventListener('keydown', (event) => {
    if (popup.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closePopup(); }
    if (event.key === 'Tab') {
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first) { event.preventDefault(); panel?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || accepted || !form.reportValidity()) return;
    if (form.dataset.leadFormLive !== 'true' || !['www.kiber-portal.ru', 'kiber-portal.ru'].includes(window.location.hostname)) {
      setStatus('Тестовая версия: заявка не отправлена. На основном сайте отправка доступна.');
      return;
    }
    submitting = true;
    const submit = form.querySelector('button[type="submit"]');
    submit?.setAttribute('disabled', 'disabled');
    setStatus('Отправляем заявку…');
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { accept: 'application/json' },
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (response.ok && result.ok === true && result.mode === 'live' && !result.dropped && typeof result.requestId === 'string' && result.requestId) {
        accepted = true;
        // UI receipt only: no form data or CRM ID.
        try { sessionStorage.setItem('kiber-lead-receipt', JSON.stringify({ accepted: true, at: Date.now() })); } catch (_) { /* Optional storage. */ }
        setStatus('Заявка отправлена. Спасибо!');
        window.location.href = '/lead/thanks/';
        return;
      }
      setStatus(failureMessage);
    } catch (_error) {
      setStatus(failureMessage);
    } finally {
      submitting = false;
      if (!accepted) submit?.removeAttribute('disabled');
    }
  });
})();
