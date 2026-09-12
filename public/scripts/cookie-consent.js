(() => {
  const banner = document.getElementById('cookie-consent');
  if (!banner || banner.dataset.initialized) return;
  banner.dataset.initialized = 'true';
  const key = 'kp-cookie-consent';
  const version = 2;
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  let returnFocus = null;
  let memoryOnly = false;
  const read = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved?.version !== version || !['accepted', 'rejected'].includes(saved.choice)
        || !Number.isFinite(saved.updatedAt) || !Number.isFinite(saved.expiresAt)
        || saved.updatedAt > Date.now() || saved.expiresAt <= Date.now()
        || saved.expiresAt - saved.updatedAt !== lifetime) return null;
      return saved.choice;
    } catch { return null; }
  };
  const size = () => document.documentElement.style.setProperty('--kp-cookie-banner-height', `${banner.hidden ? 0 : banner.getBoundingClientRect().height}px`);
  const apply = (choice) => {
    document.documentElement.dataset.cookieConsent = choice || 'unset';
    banner.hidden = choice !== null;
    size();
    window.dispatchEvent(new CustomEvent('kp:cookie-consent', {detail: {choice, optional: choice === 'accepted', version}}));
  };
  banner.querySelectorAll('[data-cookie-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const choice = button.dataset.cookieChoice;
      if (!['accepted', 'rejected'].includes(choice)) return;
      const now = Date.now();
      try {
        localStorage.setItem(key, JSON.stringify({version, choice, updatedAt: now, expiresAt: now + lifetime}));
        memoryOnly = false;
      } catch { memoryOnly = true; }
      apply(choice);
      if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
      else document.querySelector('[data-cookie-settings]')?.focus({preventScroll: true});
    });
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      returnFocus = button;
      banner.hidden = false;
      size();
      banner.querySelector('button')?.focus({preventScroll: true});
    });
  });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { memoryOnly = false; apply(read()); } });
  window.addEventListener('pageshow', () => { if (!memoryOnly) apply(read()); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !memoryOnly) apply(read()); });
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(banner);
  apply(read());
})();
