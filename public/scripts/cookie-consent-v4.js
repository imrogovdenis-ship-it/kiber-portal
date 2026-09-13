/* Shared preference authority for the banner and policy-page settings. */
(() => {
  const banner = document.getElementById('cookie-consent');
  if (!banner || banner.dataset.initialized) return;
  banner.dataset.initialized = 'true';
  const key = 'kp-cookie-consent';
  const deniedKey = 'kp-analytics-session-denied';
  const version = 4;
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const names = {off: 'Без аналитики', basic: 'Только базовая аналитика', extended: 'Базовая аналитика и запись действий'};
  const block = document.getElementById('analytics-settings');
  const toggle = block?.querySelector('[data-analytics-toggle]');
  const panel = block?.querySelector('[data-analytics-panel]');
  const form = block?.querySelector('form');
  const status = block?.querySelector('[data-analytics-status]');
  const feedback = block?.querySelector('[data-analytics-feedback]');
  let memoryOnly = false;
  let current;
  let expiryTimer;
  const read = () => {
    try {
      try { if (sessionStorage.getItem(deniedKey) === '1') return {mode: 'off', acknowledged: true}; } catch {}
      const raw = localStorage.getItem(key);
      if (raw === null) return {mode: 'basic', acknowledged: false};
      const saved = JSON.parse(raw);
      const now = Date.now();
      if ([1, 2, 3].includes(saved?.version)) {
        const declined = saved.version === 3 && saved.choice === 'rejected'
          && Number.isFinite(saved.updatedAt) && saved.updatedAt <= now
          && saved.expiresAt > now && saved.expiresAt - saved.updatedAt === lifetime;
        return {mode: 'basic', acknowledged: declined};
      }
      if (saved?.version !== version || !Object.hasOwn(names, saved.mode)
        || !Number.isFinite(saved.updatedAt) || saved.updatedAt > now) throw Error('Invalid preference');
      if (saved.mode === 'off') return {mode: 'off', acknowledged: true};
      if (!Number.isFinite(saved.expiresAt) || saved.expiresAt - saved.updatedAt !== lifetime) throw Error('Invalid expiry');
      if (saved.expiresAt <= now) return {mode: 'basic', acknowledged: false};
      return {mode: saved.mode, acknowledged: true, expiresAt: saved.expiresAt};
    } catch { return {mode: 'off', acknowledged: false, storageError: true}; }
  };
  const size = () => document.documentElement.style.setProperty('--kp-cookie-banner-height', `${banner.hidden ? 0 : banner.getBoundingClientRect().height}px`);
  const inputs = () => form?.querySelectorAll('input[name="analytics-mode"]') || [];
  const stopFailureText = 'Не удалось подтвердить остановку аналитики. Закройте эту вкладку; сохранение отказа для следующих посещений не гарантируется.';
  const stopFailed = () => document.documentElement.dataset.analyticsStopFailed === 'true';
  const resetInputs = () => inputs().forEach(input => { input.checked = input.value === current.mode; });
  const apply = (state, source = 'load', persisted = true) => {
    const preserveDraft = panel && !panel.hidden && !['load', 'settings', 'banner'].includes(source);
    const modeChanged = current && current.mode !== state.mode;
    current = state;
    if (typeof clearTimeout === 'function') clearTimeout(expiryTimer);
    if (Number.isFinite(state.expiresAt) && state.expiresAt > Date.now() && typeof setTimeout === 'function') {
      expiryTimer = setTimeout(() => { if (!memoryOnly) apply(read(), 'expiry'); }, Math.min(state.expiresAt - Date.now(), 2147483647));
    }
    document.documentElement.dataset.analyticsMode = state.mode;
    document.documentElement.dataset.cookieConsent = state.acknowledged ? (state.mode === 'extended' ? 'accepted' : 'rejected') : 'unset';
    banner.hidden = state.acknowledged;
    if (status) status.textContent = names[state.mode];
    if (!preserveDraft) resetInputs();
    if (state.storageError && feedback) feedback.textContent = 'Не удалось прочитать настройки браузера. Аналитика выключена; выберите режим заново.';
    if (preserveDraft && modeChanged && feedback) {
      feedback.textContent = (state.storageError ? 'Не удалось прочитать настройки браузера. Аналитика выключена. ' : '')
        + `Текущий режим изменился: ${names[state.mode]}. Ваш выбор в открытой форме сохранён, но не применён. Нажмите «Сохранить», чтобы применить его.`;
    }
    size();
    window.dispatchEvent(new CustomEvent('kp:cookie-consent', {detail: {version, mode: state.mode, choice: document.documentElement.dataset.cookieConsent, optional: state.mode === 'extended', source, persisted}}));
    if (stopFailed()) { if (status) status.textContent = stopFailureText; if (feedback) feedback.textContent = stopFailureText; }
  };
  const save = (mode, source) => {
    if (!Object.hasOwn(names, mode)) return;
    const now = Date.now();
    let persisted = true;
    try {
      localStorage.setItem(key, JSON.stringify({version, mode, updatedAt: now, expiresAt: mode === 'off' ? null : now + lifetime}));
      try { sessionStorage.removeItem(deniedKey); } catch {}
    } catch {
      persisted = false;
      // Best-effort tab-scoped veto prevents stale permission after a storage write failure.
      try { sessionStorage.setItem(deniedKey, '1'); } catch {}
    }
    memoryOnly = !persisted;
    // Failed writes must never activate/re-activate tracking on stale permission.
    if (persisted) banner.querySelector('[data-cookie-storage-warning]')?.remove();
    apply({mode: persisted ? mode : 'off', acknowledged: true, expiresAt: persisted && mode !== 'off' ? now + lifetime : null}, source, persisted);
    if (feedback) feedback.textContent = stopFailed() ? stopFailureText : persisted
      ? (mode === 'off' ? 'Аналитика отключена.' : 'Настройки сохранены.')
      : 'Не удалось сохранить выбор. Аналитика выключена на этой странице; сохранение для будущих посещений не гарантируется.';
    if (!persisted && source === 'banner') {
      banner.hidden = false;
      let warning = banner.querySelector('[data-cookie-storage-warning]');
      if (!warning) { warning = document.createElement('p'); warning.dataset.cookieStorageWarning = ''; warning.setAttribute('role', 'status'); banner.querySelector('.cookie-consent__copy')?.appendChild(warning); }
      warning.textContent = stopFailed() ? stopFailureText : 'Не удалось сохранить выбор. Аналитика выключена на этой странице.';
      size();
    }
  };
  banner.querySelectorAll('[data-cookie-choice]').forEach(button => button.addEventListener('click', () => {
    const choice = button.dataset.cookieChoice;
    if (choice === 'accepted' || choice === 'rejected') save(choice === 'accepted' ? 'extended' : 'basic', 'banner');
  }));
  const closePanel = () => {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus({preventScroll: true});
  };
  if (toggle && panel) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      resetInputs();
      if (!panel.hidden) form?.querySelector('input:checked')?.focus({preventScroll: true});
    });
    form?.addEventListener('submit', event => {
      event.preventDefault();
      const selected = form.querySelector('input[name="analytics-mode"]:checked');
      if (selected) { save(selected.value, 'settings'); closePanel(); }
    });
    block.querySelector('[data-analytics-cancel]')?.addEventListener('click', () => { resetInputs(); closePanel(); });
  }
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { memoryOnly = false; apply(read(), 'storage'); } });
  window.addEventListener('pageshow', event => { if (!memoryOnly) apply(read(), event.persisted ? 'restore' : 'sync'); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !memoryOnly) apply(read(), 'sync'); });
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(banner);
  apply(read());
})();
