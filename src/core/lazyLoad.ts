import { createClickTrigger } from './triggers/click';
import { createDelayTrigger } from './triggers/delay';
import { createIdleTrigger } from './triggers/idle';
import { createMousemoveTrigger } from './triggers/mousemove';
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
  importer: LazyImporter<T> | LazyImporter<T>[],
  options: LazyLoadOptions
): LazyLoadController<T | T[]> {
  let hasLoaded = false;
  let result: Promise<T | T[]> | null = null;
  let cleanup: (() => void) | undefined;

  const load = () => {
    if (hasLoaded && result) return result;
    hasLoaded = true;
    cleanup?.();
    if (Array.isArray(importer)) {
      result = Promise.all(importer.map((fn) => fn()));
    } else {
      result = importer();
    }
    return result;
  };

  switch (options.on) {
    case 'idle':
      cleanup = createIdleTrigger(load);
      break;

    case 'delay':
      cleanup = createDelayTrigger(options.delay, load);
      break;

    case 'click':
      cleanup = createClickTrigger(options.target, load);
      break;

    case 'mousemove': {
      cleanup = createMousemoveTrigger(options.target, load);
      break;
    }

    case 'visible': {
      cleanup = createVisibleTrigger(options.target, load);
      break;
    }

    default:
      throw new Error('Unsupported event type!');
  }

  return {
    trigger: () => Promise.resolve(load()),
    cancel: () => cleanup?.(),
    get hasLoaded() {
      return hasLoaded;
    },
  };
}
