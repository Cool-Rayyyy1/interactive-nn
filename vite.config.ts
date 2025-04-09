import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['camera-controls']
  },

  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
