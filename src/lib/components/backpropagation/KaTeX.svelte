<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import { onMount } from 'svelte';

  let { math = '', block = false } = $props();
  let container = $state<HTMLElement>();

  $effect(() => {
    if (container) {
      katex.render(math, container, {
        throwOnError: false,
        displayMode: block
      });
    }
  });
</script>

<span bind:this={container}></span>
