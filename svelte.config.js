import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess(), mdsvex({
    layout: {
      _: './src/lib/markdown-layout.svelte'
    },
  })],
  kit: { adapter: adapter() },
  extensions: ['.svelte', '.svx']
};

export default config;
