/* Consent-gated Yandex.Metrica. No raw form data or automatic link tracking. */
(() => {
  if (document.currentScript?.dataset.production !== 'true'
    || !['kiber-portal.ru', 'www.kiber-portal.ru'].includes(location.hostname)
    || /^\/(?:lead|api|thank-you|success)(?:\/|$)/.test(location.pathname)
    || window.kpMetricaInstalled) return;
  window.kpMetricaInstalled = true;
  const id = 112523930;
  let started = false;
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
  const eraseCookies = () => {
    document.cookie.split(';').forEach(part => {
      const name = part.trim().split('=')[0];
      if (!/^_ym_/.test(name)) return;
      for (const domain of ['', location.hostname, '.kiber-portal.ru']) {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      }
    });
  };
  const apply = (event) => {
    const allowed = event?.detail?.version === 2 && document.documentElement.dataset.cookieConsent === 'accepted';
    if (!allowed) {
      if (started) {
        // Destroy the loaded counter; discard queued init if its download is still in flight.
        if (loaded && typeof window.ym === 'function') window.ym(id, 'destruct');
        if (window.ym?.a) window.ym.a.length = 0;
        script?.remove();
        started = false;
        eraseCookies();
        // Reload is the hard boundary for SDK listeners and a late-loading script.
        location.reload();
      }
      return;
    }
    if (started) return;
    protect();
    new MutationObserver(protect).observe(document.documentElement, {childList: true, subtree: true});
    started = true;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = Date.now();
    window.ym(id, 'init', {
      webvisor: true, clickmap: true, trackLinks: false, accurateTrackBounce: true,
      url: cleanUrl(location.origin + location.pathname), referrer: cleanUrl(document.referrer)
    });
    script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + id;
    script.onload = () => { loaded = true; };
    document.head.appendChild(script);
  };
  window.addEventListener('kp:cookie-consent', apply);
  apply();
})();
