<script lang="ts">
  import { fade } from 'svelte/transition';
  import { Zap, Calculator } from 'lucide-svelte';
  import Latex from './Latex.svelte';

  interface Props {
    symbolicMath: string | null;
    numericMath: string | null;
  }

  let { symbolicMath, numericMath }: Props = $props();
</script>

<div class="grid grid-cols-1 divide-y divide-[#141414] bg-white text-[#141414]" id="math-panel">
  <!-- Symbolic Equation Box -->
  <div class="p-6 border-0">
    <h5 class="tech-label mb-4 flex items-center gap-2 text-[#141414]/70 font-mono text-[10px]">
      <Zap class="w-3.5 h-3.5 text-[#F27D26]" /> Symbolic Expression Mapping
    </h5>
    <div class="flex items-center justify-center overflow-x-auto min-h-[60px]">
      {#if symbolicMath}
        <div
          transition:fade={{ duration: 250 }}
          class="text-xl text-[#141414] py-2"
        >
          <Latex math={symbolicMath} />
        </div>
      {:else}
        <p class="font-mono text-xs uppercase tracking-wider text-[#141414]/40 italic">Awaiting symbol stream...</p>
      {/if}
    </div>
  </div>

  <!-- Numerical Calculation Box -->
  <div class="p-6 border-0">
    <h5 class="tech-label mb-4 flex items-center gap-2 text-[#141414]/70 font-mono text-[10px]">
      <Calculator class="w-3.5 h-3.5 text-[#141414]" /> Numerical Evaluation Trace
    </h5>
    <div class="flex items-center justify-center overflow-x-auto min-h-[60px]">
      {#if numericMath}
        <div
          transition:fade={{ duration: 250 }}
          class="text-lg text-[#141414] py-2 font-mono"
        >
          <Latex math={numericMath} />
        </div>
      {:else}
        <p class="font-mono text-xs uppercase tracking-wider text-[#141414]/40 italic">Awaiting evaluation trace...</p>
      {/if}
    </div>
  </div>
</div>
