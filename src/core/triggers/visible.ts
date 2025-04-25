export function createVisibleTrigger(
  target: HTMLElement,
  callback: () => void,
  rootMargin?: string,
  threshold?: number
) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          obs.disconnect();
        }
      });
    },
    {
      rootMargin,
      threshold,
    }
  );
  observer.observe(target);
  return () => observer.disconnect();
}
