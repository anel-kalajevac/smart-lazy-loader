type LazyLoadOptions =
  | {
      on: 'visible';
      target: HTMLElement;
      delay?: never;
      rootMargin?: string;
      threshold?: number;
    }
  | {
      on: 'delay';
      target: HTMLElement;
      delay: number;
      rootMargin?: never;
      threshold?: never;
    }
  | {
      on: 'idle' | 'click' | 'mousemove';
      target: HTMLElement;
      delay?: never;
      rootMargin?: never;
      threshold?: never;
    };

type LazyLoadController<T> = {
  trigger: () => Promise<T>;
  cancel: () => void;
  hasLoaded: boolean;
};

export function lazyLoad<T>(
  importer: () => Promise<T>,
  options: LazyLoadOptions
): LazyLoadController<T> {
  const { on = 'visible', target, delay, rootMargin = '0', threshold = 0 } = options;
  let hasLoaded = false;
  let result: Promise<T> | null = null;
  let cleanup: (() => void) | undefined;

  const load = () => {
    if (hasLoaded && result) return result;
    hasLoaded = true;
    cleanup?.();
    result = importer();
    return result;
  };

  switch (on) {
    case 'idle':
      if ('requestIdleCallback' in window) {
        const id = requestIdleCallback(() => load());
        cleanup = () => cancelIdleCallback(id);
      } else {
        const fallbackId = setTimeout(() => load(), 2000);
        cleanup = () => clearTimeout(fallbackId);
      }
      break;

    case 'delay':
      const timeoutId = setTimeout(() => load(), delay);
      cleanup = () => clearTimeout(timeoutId);
      break;

    case 'click':
      const onClick = () => load();
      target.addEventListener('click', onClick, { once: true });
      cleanup = () => target.removeEventListener('click', onClick);
      break;

    case 'mousemove':
      const onMousemove = () => load();
      target.addEventListener('mousemove', onMousemove, { once: true });
      cleanup = () => target.removeEventListener('mousemove', onMousemove);
      break;

    case 'visible':
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              load();
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
      cleanup = () => observer.disconnect();
      break;

    default:
      throw new Error('Unsupported event type: ' + on);
  }

  return {
    trigger: () => Promise.resolve(load()),
    cancel: () => cleanup?.(),
    get hasLoaded() {
      return hasLoaded;
    },
  };
}
