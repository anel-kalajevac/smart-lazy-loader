# smart-lazy-loader

> A simple and flexible lazy load utility that works in various event-driven scenarios, such as visibility, idle, click, and mousemove. Optimized for performance and can be easily integrated into any JavaScript or TypeScript project.

![npm version](https://img.shields.io/npm/v/smart-lazy-loader)
![license](https://img.shields.io/npm/l/smart-lazy-loader)
![bundle size](https://img.shields.io/bundlephobia/minzip/smart-lazy-loader)
![types](https://img.shields.io/npm/types/smart-lazy-loader)
![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![semantic release](https://img.shields.io/badge/release-semantic--release-blue)
![stars](https://img.shields.io/github/stars/anel-kalajevac/smart-lazy-loader?style=social)

## ✨ Features

- ⚡ **Framework agnostic**: Works with any JavaScript framework, or vanilla JavaScript.
- 🧠 **Event-based loading**: Load components or execute code based on multiple events:
  - `visible` (IntersectionObserver)
  - `idle` (using `requestIdleCallback` or `setTimeout`)
  - `delay` (with customizable delay)
  - `click` (triggered on user click)
  - `mousemove` (triggered on user mouse movement)
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

lazyLoad(MyComponent, {
  on: 'visible',
  target,
  rootMargin: '100px', // trigger 100px before component is visible
  threshold: 0.5, // trigger when 50% of the component is visible
});
```

### Example: Lazy loading after a delay

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');
const target = document.getElementById('component-target') as HTMLElement;

lazyLoad(MyComponent, {
  on: 'delay',
  target,
  delay: 1000, // wait 1 second before loading
});
```

### Example: Lazy loading when the user clicks

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');
const target = document.getElementById('component-target') as HTMLElement;

lazyLoad(MyComponent, {
  on: 'click',
  target,
});
```

### Example: Lazy loading on mouse move

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');
const target = document.getElementById('component-target') as HTMLElement;

lazyLoad(MyComponent, {
  on: 'mousemove',
  target,
});
```

### Example: Lazy loading when the page is idle

```ts
import { lazyLoad } from 'smart-lazy-loader';

const MyComponent = () => import('./MyComponent');
const target = document.getElementById('component-target') as HTMLElement;

lazyLoad(MyComponent, {
  on: 'idle',
  target,
});
```

## 🛠 Configuration Options

- `on` (Required)

  - `visible` - Use `IntersectionObserver` to load when the element is visible in the viewport.
  - `idle` - Load when the browser is idle (either via `requestIdleCallback` or `setTimeout` fallback).
  - `delay` - Load after a specified delay in milliseconds.
  - `click` - Load when the user clicks on the target.
  - `mousemove` - Load when the user moves the mouse over the target.

- `target` (Required)

  - The DOM element that you want to observe or attach the event to.

- `delay` (Optional)

  - The delay in milliseconds before loading the component (used when on is set to `'delay'`).

- `rootMargin` (Optional)

  - Used with `'visible'` event type. The margin around the root element to trigger the lazy load earlier or later. Default is '0'.

- `threshold` (Optional)
  - The percentage of the target element that must be visible before it’s considered in view. A value between 0 and 1, with 0.5 representing 50% visibility.

## 🤝 Contributing

Contributions are welcome! If you have suggestions or improvements, please create an issue or submit a pull request.
