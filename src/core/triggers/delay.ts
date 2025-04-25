export function createDelayTrigger(delay: number, callback: () => void) {
  const timeoutId = setTimeout(callback, delay);
  return () => clearTimeout(timeoutId);
}
