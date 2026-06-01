<script lang="ts">
  import katex from 'katex';
  import 'katex/dist/katex.min.css';

  interface Props {
    math: string;
    inline?: boolean;
  }

  let { math, inline = false }: Props = $props();

  let html = $derived(() => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: !inline
      });
    } catch (e) {
      return math;
    }
  });
</script>

<span class="inline-block max-w-full overflow-x-auto text-[#141414]">
  {@html html()}
</span>
