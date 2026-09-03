(() => {
  const pageX = (event, fallback) => ('touches' in event ? (event.touches[0]?.pageX ?? fallback) : event.pageX);

  document.querySelectorAll('[data-drag-slider="true"]').forEach((slider) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    slider.querySelectorAll('a, img').forEach((item) => {
      item.setAttribute('draggable', 'false');
      item.addEventListener('dragstart', (event) => event.preventDefault());
    });

    const start = (event) => {
      if ('button' in event && event.button !== 0 && event.button !== 2) return;
      isDown = true;
      moved = 0;
      startX = pageX(event, startX);
      startScroll = slider.scrollLeft;
      slider.classList.add('is-dragging');
      event.preventDefault();
    };

    const move = (event) => {
      if (!isDown) return;
      const dx = pageX(event, startX) - startX;
      moved = Math.max(moved, Math.abs(dx));
      slider.scrollLeft = startScroll - dx;
      event.preventDefault();
    };

    const stop = () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
    };

    slider.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move, { passive: false });
    window.addEventListener('mouseup', stop);
    slider.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', stop);
    slider.addEventListener('contextmenu', (event) => event.preventDefault());
    slider.addEventListener('click', (event) => {
      if (moved > 5) {
        event.preventDefault();
        event.stopPropagation();
        moved = 0;
      }
    }, true);
  });
})();
