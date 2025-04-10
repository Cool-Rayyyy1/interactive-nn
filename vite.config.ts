import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['camera-controls']
  },
  // Directory pattern for Vitest
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  // Tell Vitest to use the `browser` entry points in `package.json` files, even though it's running in Node
  resolve: process.env.VITEST
    ? {
      conditions: ['browser']
    }
    : undefined
});
