export function createMousemoveTrigger(target: HTMLElement, listener: () => void) {
  target.addEventListener('mousemove', listener, { once: true });
  return () => target.removeEventListener('mousemove', listener);
}
