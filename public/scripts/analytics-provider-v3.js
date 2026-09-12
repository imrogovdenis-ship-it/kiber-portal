/* Basic Metrica on page load; optional Webvisor under consent v3. */
(() => {
  if (document.currentScript?.dataset.production !== 'true'
    || !['kiber-portal.ru', 'www.kiber-portal.ru'].includes(location.hostname)
    || /^\/(?:lead|api|thank-you|success)(?:\/|$)/.test(location.pathname)
    || window.kpMetricaInstalled) return;
  window.kpMetricaInstalled = true;
  const id = 112523930;
  let mode = null;
  let loaded = false;
  let script;
  const protect = () => {
    document.querySelectorAll('form, [data-lead-form-popup], [data-lead-form-popup-status]').forEach(e => e.classList.add('ym-hide-content'));
    document.querySelectorAll('input, textarea, select, [contenteditable]').forEach(e => {
      e.classList.remove('ym-record-keys', 'ym-show-content');
      e.classList.add('ym-disable-keys', 'ym-hide-content');
    });
  };
  const cleanUrl = (raw) => {
    try { const u = new URL(raw); return /^https?:$/.test(u.protocol) ? u.origin + u.pathname : ''; }
    catch { return ''; }
  };
  const markerKey = 'kp-metrica-revoke-reload';
  const consumeReload = () => {
    try {
      const mark = JSON.parse(sessionStorage.getItem(markerKey) || 'null');
      sessionStorage.removeItem(markerKey);
      return mark?.path === location.pathname && Date.now() >= mark.at && Date.now() - mark.at < 10000;
    } catch { return false; }
  };
  const revoke = () => {
    if (loaded && typeof window.ym === 'function') window.ym(id, 'destruct');
    else if (window.ym?.a) window.ym.a.length = 0;
    script?.remove();
    // Preserve basic visitor cookies; erase only the optional recorder cookie.
    for (const domain of ['', location.hostname, '.kiber-portal.ru']) {
      document.cookie = '_ym_visorc=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
    }
    try { sessionStorage.setItem(markerKey, JSON.stringify({path: location.pathname, at: Date.now()})); } catch {}
    location.reload();
  };
  const apply = (event) => {
    const optional = event?.detail?.version === 3 && document.documentElement.dataset.cookieConsent === 'accepted';
    if (mode !== null) {
      if (mode && !optional) { mode = false; revoke(); }
      // Acceptance applies on the next normal page navigation, without a second pageview.
      return;
    }
    mode = optional;
    protect();
    new MutationObserver(protect).observe(document.documentElement, {childList: true, subtree: true});
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    window.ym(id, 'init', {
      webvisor: optional, clickmap: optional, trackLinks: false, accurateTrackBounce: true,
      defer: consumeReload(), ecommerce: false, disableYtm: true,
      url: cleanUrl(location.origin + location.pathname), referrer: cleanUrl(document.referrer)
    });
    script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id;
    script.onload = () => { loaded = true; };
    document.head.appendChild(script);
  };
  // The shared consent controller emits immediately during page load, even without a user choice.
  window.addEventListener('kp:cookie-consent', apply);
})();
