export function createIdleTrigger(callback: IdleRequestCallback) {
  let cleanup;
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(callback);
    cleanup = () => cancelIdleCallback(id);
  } else {
    const fallbackId = setTimeout(callback, 2000);
    cleanup = () => clearTimeout(fallbackId);
  }
  return cleanup;
}
