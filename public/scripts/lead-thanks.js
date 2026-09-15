(() => {
  let receipt;
  try {
    receipt = JSON.parse(sessionStorage.getItem('kiber-lead-receipt') || 'null');
    sessionStorage.removeItem('kiber-lead-receipt');
  } catch (_) { return; }
  const age = Date.now() - receipt?.at;
  if (receipt?.accepted !== true || !Number.isFinite(age) || age < 0 || age > 10 * 60 * 1000) return;
  const title = document.querySelector('[data-lead-thanks-title]');
  const message = document.querySelector('[data-lead-thanks-message]');
  const mark = document.querySelector('[data-lead-thanks-mark]');
  if (title) title.textContent = 'Спасибо, заявка отправлена';
  if (message) message.textContent = 'Сервис подтвердил отправку вашей заявки. Менеджер свяжется с вами, чтобы обсудить задачу и подходящий формат участия робота.';
  if (mark) mark.textContent = '✓';
})();
