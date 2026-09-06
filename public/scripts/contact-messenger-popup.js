(() => {
  const popup = document.querySelector('[data-contact-popup]');
  if (!popup) return;

  const panel = popup.querySelector('.contact-messenger-popup__panel');
  const triggers = document.querySelectorAll('[data-contact-popup-trigger], a[href="#contact-messengers"]');
  let previousFocus = null;

  const openPopup = (event) => {
    if (event) event.preventDefault();
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    popup.hidden = false;
    document.body.classList.add('contact-messenger-popup-open');
    requestAnimationFrame(() => panel?.focus({ preventScroll: true }));
  };

  const closePopup = () => {
    popup.hidden = true;
    document.body.classList.remove('contact-messenger-popup-open');
    previousFocus?.focus?.({ preventScroll: true });
  };

  triggers.forEach((trigger) => trigger.addEventListener('click', openPopup));
  popup.querySelectorAll('[data-contact-popup-close]').forEach((control) => control.addEventListener('click', closePopup));
  document.addEventListener('keydown', (event) => {
    if (!popup.hidden && event.key === 'Escape') closePopup();
  });
})();
