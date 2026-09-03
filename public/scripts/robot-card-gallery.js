(() => {
  const setupSlider = (slider) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;

    slider.querySelectorAll('a, img').forEach((item) => {
      item.setAttribute('draggable', 'false');
      item.addEventListener('dragstart', (event) => event.preventDefault());
    });

    slider.addEventListener('mousedown', (event) => {
      if (event.button !== 0 && event.button !== 2) return;
      isDown = true;
      moved = 0;
      startX = event.pageX;
      startScroll = slider.scrollLeft;
      slider.classList.add('is-dragging');
      event.preventDefault();
    });

    window.addEventListener('mousemove', (event) => {
      if (!isDown) return;
      const dx = event.pageX - startX;
      moved = Math.max(moved, Math.abs(dx));
      slider.scrollLeft = startScroll - dx;
      event.preventDefault();
    }, { passive: false });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');
    });

    slider.addEventListener('contextmenu', (event) => event.preventDefault());
    slider.addEventListener('click', (event) => {
      if (moved > 5) {
        event.preventDefault();
        event.stopPropagation();
        moved = 0;
      }
    }, true);
  };

  document.querySelectorAll('[data-drag-slider^="robot-"]').forEach(setupSlider);

  document.querySelectorAll('[data-slider-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      const selector = button.dataset.sliderPrev;
      if (!selector) return;
      const slider = document.querySelector(selector);
      if (slider) slider.scrollBy({ left: -slider.clientWidth * 0.8, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-slider-next]').forEach((button) => {
    button.addEventListener('click', () => {
      const selector = button.dataset.sliderNext;
      if (!selector) return;
      const slider = document.querySelector(selector);
      if (slider) slider.scrollBy({ left: slider.clientWidth * 0.8, behavior: 'smooth' });
    });
  });
})();
