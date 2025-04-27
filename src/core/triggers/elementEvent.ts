export function createElementEventTrigger(
  target: HTMLElement,
  listener: () => void,
  eventName: keyof HTMLElementEventMap | string,
  options?: AddEventListenerOptions
) {
  target.addEventListener(eventName, listener, options);
  return () => target.removeEventListener(eventName, listener);
}
