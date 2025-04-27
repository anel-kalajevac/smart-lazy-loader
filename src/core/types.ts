type VisibleOptions = {
  on: 'visible';
  target: HTMLElement;
  rootMargin?: string;
  threshold?: number;
};

type DelayOptions = {
  on: 'delay';
  delay: number;
};

type IdleOptions = { on: 'idle' };

type ElementEventOptions = {
  on: 'element-event';
  target: HTMLElement;
  eventName: keyof HTMLElementEventMap | string;
  eventOptions?: AddEventListenerOptions;
};

export type LazyLoadOptions = VisibleOptions | DelayOptions | IdleOptions | ElementEventOptions;

export type LazyLoadController<T> = {
  trigger: () => Promise<T>;
  cancel: () => void;
  hasLoaded: boolean;
};

export type LazyImporter<T> = () => Promise<T>;
