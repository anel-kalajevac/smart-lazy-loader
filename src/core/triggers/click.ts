export function createClickTrigger(target: HTMLElement, listener: () => void) {
  target.addEventListener('click', listener, { once: true });
  return () => target.removeEventListener('click', listener);
}
