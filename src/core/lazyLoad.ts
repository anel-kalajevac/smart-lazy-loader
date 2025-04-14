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

export function lazyLoad<T>(
  importer: () => Promise<T>,
  options: LazyLoadOptions
): Promise<T> | void {
  const { on = 'visible', target, delay, rootMargin = '0', threshold = 0 } = options;

  const load = () => importer();

  switch (on) {
    case 'idle':
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => load());
      } else {
        setTimeout(() => load(), 2000);
      }
      break;

    case 'delay':
      setTimeout(() => load(), delay);
      break;

    case 'click':
      const onClick = () => {
        load();
        target.removeEventListener('click', onClick);
      };
      target.addEventListener('click', onClick);
      break;

    case 'mousemove':
      const onMousemove = () => {
        load();
        target.removeEventListener('mousemove', onMousemove);
      };
      target.addEventListener('mousemove', onMousemove);
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
      break;

    default:
      throw new Error('Unsupported event type: ' + on);
  }
}
