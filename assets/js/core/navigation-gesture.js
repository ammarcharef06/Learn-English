export function createRouteHistory() {
  const paths = [];
  let index = -1;

  return {
    remember(path) {
      if (!path || paths[index] === path) return;
      if (index > 0 && paths[index - 1] === path) {
        index -= 1;
        return;
      }
      paths.splice(index + 1);
      paths.push(path);
      index = paths.length - 1;
    },
    canGoBack() {
      return index > 0;
    },
    back() {
      if (index < 1) return null;
      index -= 1;
      return paths[index];
    },
  };
}

export function bindSwipeBack({ canGoBack, onBack }) {
  let start = null;
  const edge = 28;
  const ignored = 'button, a, input, select, textarea, [contenteditable="true"], [role="slider"], canvas, .fc-shell, .fc-sheet, .zero-pad, [data-no-back-swipe], [role="dialog"]';

  document.addEventListener('pointerdown', (event) => {
    start = null;
    if (event.pointerType !== 'touch' || event.isPrimary === false) return;
    if (document.body.classList.contains('fc-focus-mode')) return;
    if (event.target.closest?.(ignored) || !canGoBack()) return;
    const rtl = document.documentElement.dir === 'rtl';
    const atEdge = rtl ? event.clientX >= window.innerWidth - edge : event.clientX <= edge;
    if (atEdge) start = { x: event.clientX, y: event.clientY, rtl };
  }, { passive: true });

  document.addEventListener('pointerup', (event) => {
    if (!start || event.pointerType !== 'touch') return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const backDirection = start.rtl ? deltaX < -64 : deltaX > 64;
    if (backDirection && Math.abs(deltaX) > Math.abs(deltaY) * 1.35) onBack();
    start = null;
  }, { passive: true });

  document.addEventListener('pointercancel', () => { start = null; }, { passive: true });
}
