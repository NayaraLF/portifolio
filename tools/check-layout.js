// Cola no console / javascript_tool. Retorna { width, overflowX, offenders }.
window.__checkLayout = function () {
  const w = window.innerWidth;
  const offenders = [];
  document.querySelectorAll('body *').forEach((el) => {
    if (el.closest('[data-allow-overflow]') || el.closest('svg')) return;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right > w + 1 || r.left < -1) {
      const id = el.id ? '#' + el.id : '';
      const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '';
      offenders.push(el.tagName.toLowerCase() + id + cls + ' [' + Math.round(r.left) + ',' + Math.round(r.right) + ']');
    }
  });
  return {
    width: w,
    overflowX: document.documentElement.scrollWidth > w,
    offenders,
  };
};
