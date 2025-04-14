type LazyLoadOptions =
  | {
      on: 'visible';
      target: HTMLElement;
      delay: never;
      threshold: number;
    }
  | {
      on: 'delay';
      target: HTMLElement;
      delay: number;
      threshold: never;
    }
  | {
      on: 'idle' | 'interaction';
      target: HTMLElement;
      delay: never;
      threshold: never;
    };

export function lazyLoad<T>(
  importer: () => Promise<T>,
  options: LazyLoadOptions
): Promise<T> | void {
  const { on = 'visible', target, delay = 2000 } = options;

  const load = () => importer();

  switch (on) {
    case 'idle':
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => load());
      } else {
        setTimeout(() => load(), delay);
      }
      break;

    case 'delay':
      setTimeout(() => load(), delay);
      break;

    case 'interaction':
      const listener = () => {
        load();
        document.removeEventListener('click', listener);
        document.removeEventListener('mousemove', listener);
      };
      document.addEventListener('click', listener);
      document.addEventListener('mousemove', listener);
      break;

    case 'visible':
    default:
      if (!target) throw new Error("Target element is required for 'visible' strategy");

      const observer = new IntersectionObserver((entries, obs) => {
        if (entries?.[0]?.isIntersecting) {
          load();
          obs.disconnect();
        }
      });
      observer.observe(target);
  }
}
