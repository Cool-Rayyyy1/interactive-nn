<script lang="ts">
  import KaTeX from './KaTeX.svelte';

  let { symbolicMath = null, numericMath = null } = $props();
</script>

<div class="p-6 space-y-6">
  {#if symbolicMath}
    <div class="space-y-2">
      <p class="tech-label text-indigo-400">Symbolic Mapping</p>
      <div class="transition-all duration-300">
        <KaTeX math={symbolicMath} block={true} />
      </div>
    </div>
  {/if}

  {#if numericMath}
    <div class="space-y-2 pt-4 border-t border-slate-100">
      <p class="tech-label text-emerald-500">Numerical Evaluation</p>
      <div class="font-mono text-sm transition-all duration-300">
        <KaTeX math={numericMath} block={true} />
      </div>
    </div>
  {/if}
</div>
