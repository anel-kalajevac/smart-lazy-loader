import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lazyLoad } from '../';

describe('lazyLoad', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('loads after delay', () => {
    const importer = vi.fn();
    const target = document.createElement('div');

    lazyLoad(importer, {
      on: 'delay',
      delay: 1000,
      target,
    });

    expect(importer).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(importer).toHaveBeenCalled();
  });

  it('loads on idle (requestIdleCallback)', () => {
    const importer = vi.fn();
    const target = document.createElement('div');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    globalThis.requestIdleCallback = (cb: Function) => cb();

    lazyLoad(importer, {
      on: 'idle',
      target,
    });

    expect(importer).toHaveBeenCalled();
  });

  it('should fallback to setTimeout if requestIdleCallback is not available', async () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const original = window.requestIdleCallback;
    // @ts-expect-error - simulating unavailable requestIdleCallback
    delete window.requestIdleCallback;

    lazyLoad(importer, {
      on: 'idle',
      target: document.createElement('div'),
    });

    // Fast-forward timeouts
    vi.runAllTimers();

    expect(importer).toHaveBeenCalled();

    // Restore original
    window.requestIdleCallback = original;
  });

  it('loads on first click only', () => {
    const importer = vi.fn();
    const target = document.createElement('div');
    document.body.appendChild(target);

    lazyLoad(importer, {
      on: 'click',
      target,
    });

    target.dispatchEvent(new MouseEvent('click'));
    expect(importer).toHaveBeenCalledTimes(1);

    target.dispatchEvent(new MouseEvent('click'));
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it('should load module on mousemove', async () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const target = document.createElement('div');

    lazyLoad(importer, {
      on: 'mousemove',
      target,
    });

    target.dispatchEvent(new MouseEvent('mousemove'));

    expect(importer).toHaveBeenCalled();
  });

  it('loads when element is visible', () => {
    const importer = vi.fn();
    const target = document.createElement('div');
    document.body.appendChild(target);

    const observe = vi.fn();
    const disconnect = vi.fn();

    const mockObserver = vi.fn(
      (cb: (a: { isIntersecting: boolean }[], b: { disconnect: typeof vi.fn }) => void) => {
        cb([{ isIntersecting: true }], { disconnect });
        return { observe, disconnect };
      }
    );

    // @ts-expect-error - mocking IntersectionObserver
    globalThis.IntersectionObserver = mockObserver;

    lazyLoad(importer, {
      on: 'visible',
      target,
      rootMargin: '0px',
      delay: undefined as never,
    });

    expect(importer).toHaveBeenCalled();
    expect(observe).toHaveBeenCalledWith(target);
  });

  it('should throw error on unsupported "on" type', () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const target = document.createElement('div');

    expect(() => {
      lazyLoad(importer, {
        // @ts-expect-error - simulating unsupported event
        on: 'unsupported',
        target,
        delay: undefined,
        rootMargin: undefined,
      });
    }).toThrow('Unsupported event type: unsupported');
  });

  it('manually triggers the load via controller.trigger()', async () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const target = document.createElement('div');

    const controller = lazyLoad(importer, {
      on: 'delay',
      delay: 1000,
      target,
    });

    expect(importer).not.toHaveBeenCalled();
    await controller.trigger();
    expect(importer).toHaveBeenCalledTimes(1);

    await controller.trigger();
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it('cancels the load before it happens', () => {
    const importer = vi.fn();
    const target = document.createElement('div');

    const controller = lazyLoad(importer, {
      on: 'delay',
      delay: 1000,
      target,
    });

    controller.cancel();
    vi.advanceTimersByTime(1000);
    expect(importer).not.toHaveBeenCalled();
  });

  it('reflects loading status in hasLoaded', async () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const target = document.createElement('div');

    const controller = lazyLoad(importer, {
      on: 'click',
      target,
    });

    expect(controller.hasLoaded).toBe(false);
    target.dispatchEvent(new MouseEvent('click'));
    expect(controller.hasLoaded).toBe(true);
  });

  it('loads multiple modules via batch import', async () => {
    const importerA = vi.fn(() => Promise.resolve('A'));
    const importerB = vi.fn(() => Promise.resolve('B'));
    const target = document.createElement('div');

    const controller = lazyLoad([importerA, importerB], {
      on: 'click',
      target,
    });

    const event = new MouseEvent('click');
    target.dispatchEvent(event);

    const result = await controller.trigger();

    expect(importerA).toHaveBeenCalledTimes(1);
    expect(importerB).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['A', 'B']);
  });

  it('cancels batch import before any modules are loaded', () => {
    const importerA = vi.fn(() => Promise.resolve('A'));
    const importerB = vi.fn(() => Promise.resolve('B'));
    const target = document.createElement('div');

    const controller = lazyLoad([importerA, importerB], {
      on: 'delay',
      delay: 1000,
      target,
    });

    controller.cancel();
    vi.advanceTimersByTime(1000);

    expect(importerA).not.toHaveBeenCalled();
    expect(importerB).not.toHaveBeenCalled();
  });

  it('batch importer only loads once even after multiple trigger calls', async () => {
    const importerA = vi.fn(() => Promise.resolve('A'));
    const importerB = vi.fn(() => Promise.resolve('B'));
    const target = document.createElement('div');

    const controller = lazyLoad([importerA, importerB], {
      on: 'click',
      target,
    });

    await controller.trigger();
    await controller.trigger();

    expect(importerA).toHaveBeenCalledTimes(1);
    expect(importerB).toHaveBeenCalledTimes(1);
  });
});
