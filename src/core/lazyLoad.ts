import { createDelayTrigger } from './triggers/delay';
import { createElementEventTrigger } from './triggers/elementEvent';
import { createIdleTrigger } from './triggers/idle';
import { createVisibleTrigger } from './triggers/visible';
import { LazyImporter, LazyLoadController, LazyLoadOptions } from './types';

export function lazyLoad<T>(
  importer: LazyImporter<T>,
  options: LazyLoadOptions
): LazyLoadController<T>;

export function lazyLoad<T>(
  importer: LazyImporter<T>[],
  options: LazyLoadOptions
): LazyLoadController<T[]>;

export function lazyLoad<T>(
  importer: LazyImporter<T>,
  options: LazyLoadOptions[]
): LazyLoadController<T>;

export function lazyLoad<T>(
  importer: LazyImporter<T>[],
  options: LazyLoadOptions[]
): LazyLoadController<T[]>;

export function lazyLoad<T>(
  importer: LazyImporter<T> | LazyImporter<T>[],
  options: LazyLoadOptions | LazyLoadOptions[]
): LazyLoadController<T | T[]> {
  let hasLoaded = false;
  let result: Promise<T | T[]> | null = null;
  let cleanups: (() => void)[] = [];
  const allOptions = Array.isArray(options) ? options : [options];

  const clean = () => {
    cleanups.forEach((c) => c());
    cleanups = [];
  };

  const load = () => {
    if (hasLoaded && result) return result;
    hasLoaded = true;
    clean();
    if (Array.isArray(importer)) {
      result = Promise.all(importer.map((fn) => fn()));
    } else {
      result = importer();
    }
    return result;
  };

  for (const option of allOptions) {
    switch (option.on) {
      case 'idle':
        cleanups.push(createIdleTrigger(load));
        break;

      case 'delay':
        cleanups.push(createDelayTrigger(option.delay, load));
        break;

      case 'visible':
        cleanups.push(
          createVisibleTrigger(option.target, load, option.rootMargin, option.threshold)
        );
        break;

      case 'element-event':
        cleanups.push(
          createElementEventTrigger(option.target, load, option.eventName, option.eventOptions)
        );
        break;

      default:
        throw new Error('Unsupported event type!');
    }
  }

  return {
    trigger: () => Promise.resolve(load()),
    cancel: () => clean(),
    get hasLoaded() {
      return hasLoaded;
    },
  };
}
