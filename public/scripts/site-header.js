(() => {
  const header = document.querySelector('.site-header');
  const toggle = header?.querySelector('.site-header__burger');
  if (!header || !toggle) return;

  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
    if (restoreFocus === true) toggle.focus({preventScroll: true});
  };

  toggle.addEventListener('click', () => {
    const open = !header.classList.contains('is-open');
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });

  header.querySelector('[data-menu-close]')?.addEventListener('click', () => closeMenu(true));
  header.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 960px)').addEventListener('change', () => closeMenu());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) closeMenu(true);
  });
})();
