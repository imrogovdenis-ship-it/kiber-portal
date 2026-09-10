(() => {
 if (window.__kiberKinescopeBound) return;
 window.__kiberKinescopeBound = true;
 document.addEventListener('click', event => {
  const button = event.target.closest('[data-kinescope-load]');
  if (!button) return;
  const frame = button.closest('.kp-kinescope-video__frame');
  const iframe = frame?.querySelector('iframe[data-kinescope-src]');
  if (!iframe || !/^https:\/\/kinescope\.(io|com)\/embed\/[A-Za-z0-9-]+$/.test(iframe.dataset.kinescopeSrc)) return;
  iframe.src = iframe.dataset.kinescopeSrc;
  iframe.hidden = false;
  button.remove();
 });
})();
