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

type ClickOptions = {
  on: 'click';
  target: HTMLElement;
};

type MousemoveOptions = {
  on: 'mousemove';
  target: HTMLElement;
};

type IdleOptions = { on: 'idle' };

export type LazyLoadOptions =
  | VisibleOptions
  | DelayOptions
  | ClickOptions
  | MousemoveOptions
  | IdleOptions;

export type LazyLoadController<T> = {
  trigger: () => Promise<T>;
  cancel: () => void;
  hasLoaded: boolean;
};

export type LazyImporter<T> = () => Promise<T>;
