(() => {
  const thanks = /^\/lead\/thanks\/?$/.test(location.pathname);
  if (document.currentScript?.dataset.production !== 'true'
    || !['kiber-portal.ru', 'www.kiber-portal.ru'].includes(location.hostname)
    || (!thanks && /^\/(?:lead|api|thank-you|success)(?:\/|$)/.test(location.pathname))
    || window.kpMetricaInstalled) return;
  window.kpMetricaInstalled = true;
  const id = 112523930;
  const markerKey = 'kp-metrica-revoke-reload';
  let mode = null;
  let loaded = false;
  let script;
  let pendingBanner = false;
  const cleanUrl = raw => {
    try { const u = new URL(raw); return /^https?:$/.test(u.protocol) ? u.origin + u.pathname : ''; }
    catch { return ''; }
  };
  const protect = () => {
    document.querySelectorAll('form, [data-lead-form-popup], [data-lead-form-popup-status]').forEach(e => e.classList.add('ym-hide-content'));
    document.querySelectorAll('input, textarea, select, [contenteditable]').forEach(e => {
      e.classList.remove('ym-record-keys', 'ym-show-content');
      e.classList.add('ym-disable-keys', 'ym-hide-content');
    });
  };
  const consumeReload = () => {
    try {
      const mark = JSON.parse(sessionStorage.getItem(markerKey) || 'null');
      sessionStorage.removeItem(markerKey);
      return mark?.path === location.pathname && Date.now() >= mark.at && Date.now() - mark.at < 10000;
    } catch { return false; }
  };
  const clearCookies = all => {
    const names = all ? [...new Set([...document.cookie.split(';').map(c => c.trim().split('=')[0]).filter(n => n.startsWith('_ym_')), '_ym_uid', '_ym_d', '_ym_isad', '_ym_visorc'])] : ['_ym_visorc'];
    for (const name of names) for (const domain of ['', location.hostname, '.kiber-portal.ru']) {
      document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
    }
  };
  const stop = all => {
    let stopped = true;
    try {
      if (loaded && typeof window.ym !== 'function') stopped = false;
      else if (loaded) window.ym(id, 'destruct');
      else if (window.ym?.a) window.ym.a.length = 0;
    } catch { stopped = false; }
    document.documentElement.dataset.analyticsStopFailed = String(!stopped);
    script?.remove();
    clearCookies(all);
    return stopped;
  };
  const start = next => {
    mode = next;
    const nohit = consumeReload();
    if (next === 'off') { clearCookies(true); return; }
    protect();
    new MutationObserver(protect).observe(document.documentElement, {childList: true, subtree: true});
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    const optional = next === 'extended' && !thanks;
    window.ym(id, 'init', {
      webvisor: optional, clickmap: optional, trackLinks: false, accurateTrackBounce: true,
      defer: nohit, ecommerce: false, disableYtm: true,
      url: cleanUrl(location.origin + location.pathname), referrer: cleanUrl(document.referrer)
    });
    script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id;
    script.onload = () => {
      loaded = true;
      // A removed script may still finish loading. Never leave its recorder running.
      if (mode === 'off') { try { if (typeof window.ym === 'function') window.ym(id, 'destruct'); } catch {} clearCookies(true); }
    };
    document.head.appendChild(script);
  };
  window.addEventListener('kp:cookie-consent', event => {
    const detail = event.detail;
    if (detail?.version !== 4 || !['off', 'basic', 'extended'].includes(detail.mode)) return;
    const next = detail.mode;
    if (mode === null) { start(next); return; }
    if (next === mode && document.documentElement.dataset.analyticsStopFailed !== 'true') return;
    if (next === 'extended' && (detail.source === 'banner' || (pendingBanner && detail.source === 'sync'))) {
      if (mode === 'off' && !script) start('basic');
      pendingBanner = true;
      return;
    }
    pendingBanner = false;
    if (mode === 'off' && !script) { start(next); return; }
    const hadHit = loaded;
    mode = next;
    const stopped = stop(next === 'off');
    // If storage failed, reloading could restore stale permission. Stay stopped instead.
    if (detail.persisted === false) {
      mode = 'off'; clearCookies(true);
      let safeReload = false;
      try { safeReload = sessionStorage.getItem('kp-analytics-session-denied') === '1'; } catch {}
      if (!stopped && safeReload) location.reload();
      return;
    }
    if (hadHit && next !== 'off') {
      try { sessionStorage.setItem(markerKey, JSON.stringify({path: location.pathname, at: Date.now()})); } catch {}
    }
    location.reload();
  });
})();
