<script lang="ts">
  import { WEIGHT_NOTATION, BIAS_NOTATION } from '$lib/store/network.svelte';

  let { weights, biases, activeElement } = $props<{
    weights: Record<string, number>;
    biases: Record<string, number>;
    activeElement: string | null;
  }>();

  function renderSubscript(text: string) {
    if (!text.includes('_')) return text;
    const [base, sub] = text.split('_');
    const cleanSub = sub.replace(/[{}]/g, '');
    return `${base}<sub>${cleanSub}</sub>`;
  }
</script>

<section class="bg-white overflow-hidden">
  <div class="tech-header">
    <h2 class="tech-label">Parameter Status</h2>
    <span class="text-[10px] text-slate-400 font-mono">REG_DUMP</span>
  </div>

  <div class="p-6">
    <div class="grid grid-cols-2 gap-8">
      <!-- Weights -->
      <div class="space-y-4">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Weights (W)</h3>
        <div class="space-y-1">
          {#each Object.entries(weights) as [key, value]}
            {@const val = value as number}
            <div class="flex items-center justify-between py-1.5 border-b border-slate-50 transition-all duration-300 {activeElement === key ? 'bg-amber-50 px-2 -mx-2 rounded' : ''}">
                <span class="font-serif italic text-slate-500 text-xs">
                {@html renderSubscript(WEIGHT_NOTATION[key] ?? key)}
                </span>
                <span class="font-mono text-xs font-bold {activeElement === key ? 'text-amber-600 animate-pulse' : 'text-slate-700'}">
                {val.toFixed(4)}
                </span>
            </div>
        {/each}
        </div>
      </div>

      <!-- Biases -->
      <div class="space-y-4">
        <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biases (B)</h3>
        <div class="space-y-1">
          {#each Object.entries(biases) as [key, value]}
            {@const val = value as number}
            <div class="flex items-center justify-between py-1.5 border-b border-slate-50 transition-all duration-300 {activeElement === key ? 'bg-amber-50 px-2 -mx-2 rounded' : ''}">
              <span class="font-serif italic text-slate-500 text-xs">
                 {@html renderSubscript(BIAS_NOTATION[key])}
              </span>
              <span class="font-mono text-xs font-bold {activeElement === key ? 'text-amber-600 animate-pulse' : 'text-slate-700'}">
                {val.toFixed(4)}
              </span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
