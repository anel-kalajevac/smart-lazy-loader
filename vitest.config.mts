import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      include: ['src/*'],
    },
  },
});
