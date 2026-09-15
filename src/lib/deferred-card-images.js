(() => {
  const root = document.documentElement;
  const fallback = () => root.classList.remove('defer-card-images');
  try {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        const cards = entry.target.closest('[data-drag-slider]')?.querySelectorAll('.home-image-cards__card') || [entry.target];
        for (const card of cards) { card.setAttribute('data-card-image-ready', ''); observer.unobserve(card); }
      }
    }, { rootMargin: '1600px' });
    const start = () => {
      try { document.querySelectorAll('.home-image-cards__card').forEach(card => observer.observe(card)); }
      catch { fallback(); }
    };
    root.classList.add('defer-card-images');
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
  } catch { fallback(); }
})();
