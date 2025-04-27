# smart-lazy-loader

> A simple and flexible lazy load utility that works in various event-driven scenarios, such as visibility, idle, click, and mousemove. Optimized for performance and can be easily integrated into any JavaScript or TypeScript project.

[![npm version](https://img.shields.io/npm/v/smart-lazy-loader)](https://www.npmjs.com/package/smart-lazy-loader)
[![license](https://img.shields.io/github/license/anel-kalajevac/smart-lazy-loader)](https://github.com/anel-kalajevac/smart-lazy-loader?tab=MIT-1-ov-file#readme)
![bundle size](https://img.shields.io/bundlephobia/minzip/smart-lazy-loader)
![types](https://img.shields.io/npm/types/smart-lazy-loader)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![semantic release](https://img.shields.io/badge/release-semantic--release-blue)
[![stars](https://img.shields.io/github/stars/anel-kalajevac/smart-lazy-loader?style=social)](https://github.com/anel-kalajevac/smart-lazy-loader)

## ✨ Features

- ⚡ **Framework agnostic**: Works with any JavaScript framework, or vanilla JavaScript.
- 🧠 **Event-based loading**: Load components or execute code based on multiple events:
  - `visible` (IntersectionObserver)
  - `idle` (using `requestIdleCallback` or `setTimeout`)
  - `delay` (with customizable delay)
  - `element-event` (triggered by existing or custom events on any DOM element)
- 📦 **Batch support**: Load multiple modules in parallel with a single or multiple triggers.
- 🛠️ **Full control**: Exposes a controller with `trigger`, `cancel`, and `hasLoaded` for more flexibility.
- 🎯 Tiny, tree-shakable, no dependencies
- 💡 Written in TypeScript with full type support

## 📦 Installation

To install the library, run the following command:

```bash
# via yarn
yarn add smart-lazy-loader

# or npm
npm install smart-lazy-loader
```

## 🔧 Usage

To use the `lazyLoad` function, simply pass a dynamic import function (or a function returning a promise) and the appropriate options.

### Example: Lazy loading a component when it is visible

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');

const target = document.getElementById('component-target') as HTMLElement;

const controller = lazyLoad(MyComponent, {
  on: 'visible',
  target,
  rootMargin: '100px',
  threshold: 0.5,
});

// Trigger manually
controller.trigger();

// Check if the component has already loaded
console.log(controller.hasLoaded); // false (initially)

// Cancel lazy loading (if it hasn't already triggered)
controller.cancel();
```

### Example: Lazy loading when a custom event is triggered on an element

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');

const target = document.getElementById('custom-event-target') as HTMLElement;

const controller = lazyLoad(MyComponent, {
  on: 'element-event', // Trigger lazy load on custom event
  eventName: 'customEvent', // Custom event name
  target,
});

// Dispatch the custom event
const event = new CustomEvent('customEvent');
target.dispatchEvent(event);
```

### Example: Lazy loading multiple modules (batch)

```ts
import { lazyLoad } from 'smart-lazy-loader';

const loadA = () => import('./ComponentA');
const loadB = () => import('./ComponentB');

const target = document.getElementById('batch-target') as HTMLElement;

lazyLoad([loadA, loadB], {
  on: 'idle',
  target,
});
```

### Example: Lazy loading with multiple triggers

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');

const target = document.getElementById('batch-target') as HTMLElement;

lazyLoad(MyComponent, [
  {
    on: 'element-event',
    eventName: 'click',
    target,
    eventOptions: { once: true },
  },
  {
    on: 'element-event',
    eventName: 'mousemove',
    target,
    eventOptions: { once: true },
  },
]);
```

## 🛠 Configuration Options

- `on` (Required)

  - `visible` - Use `IntersectionObserver` to load when the element is visible in the viewport.
  - `idle` - Load when the browser is idle (either via `requestIdleCallback` or `setTimeout` fallback).
  - `delay` - Load after a specified delay in milliseconds.
  - `element-event` - Load when a custom event is triggered on a target element (e.g., `click`, `customEvent`, etc.).

- `target` (Required)

  - The DOM element that you want to observe or attach the event to.

- `delay` (Optional)

  - The delay in milliseconds before loading the component (used when on is set to `'delay'`).

- `rootMargin` (Optional)

  - Used with `'visible'` event type. The margin around the root element to trigger the lazy load earlier or later. Default is '0'.

- `threshold` (Optional)

  - The percentage of the target element that must be visible before it’s considered in view. A value between 0 and 1, with 0.5 representing 50% visibility.

- `eventName` (Required for `element-event`)

  - The name of the custom event to trigger lazy loading (e.g., `click`, `customEvent`, etc.).

- `eventOptions` (Optional for `element-event`)

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, please create an issue or submit a pull request.
