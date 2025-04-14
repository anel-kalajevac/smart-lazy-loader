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
    (globalThis as any).requestIdleCallback = (cb: Function) => cb();

    lazyLoad(importer, {
      on: 'idle',
      target,
    });

    expect(importer).toHaveBeenCalled();
  });

  it('should fallback to setTimeout if requestIdleCallback is not available', async () => {
    const importer = vi.fn(() => Promise.resolve('module'));
    const original = window.requestIdleCallback;
    // @ts-ignore
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

    const mockObserver = vi.fn((cb: any) => {
      cb([{ isIntersecting: true }], { disconnect });
      return { observe, disconnect };
    });

    globalThis.IntersectionObserver = mockObserver as any;

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
});
