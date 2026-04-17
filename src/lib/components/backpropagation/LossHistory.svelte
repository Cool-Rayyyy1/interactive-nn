<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { Target } from 'lucide-svelte';
  import type { HistoryItem } from '$lib/types';

  let { history, epoch } = $props<{ history: HistoryItem[], epoch: number }>();

  let maxLoss = $derived(
  Math.max(...history.map((h: HistoryItem) => h.loss), 0.1) * 1.2
);

let points = $derived(
  history.map((h: HistoryItem, i: number) => {
    const x = (i / (Math.max(history.length - 1, 1))) * 100;
    const y = 100 - (h.loss / maxLoss) * 100;
    return `${x},${y}`;
  }).join(' ')
);
</script>

<section class="bg-white overflow-hidden">
  <div class="tech-header">
    <h2 class="tech-label flex items-center gap-2">
      <Target class="w-3 h-3" /> Loss History (MSE)
    </h2>
    <span class="text-[10px] text-slate-400 font-mono">DUMP_CHART</span>
  </div>

  <div class="p-6 h-64">
    <div class="h-40 w-full relative group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full overflow-visible">
        <!-- Grid lines -->
        <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" stroke-width="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" stroke-width="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" stroke-width="0.5" />
        
        {#if history.length > 1}
          <polyline
            fill="none"
            stroke="#2563eb"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            points={points}
            class="transition-all duration-300"
          />
        {/if}
      </svg>
      
      {#if history.length === 0}
        <div class="absolute inset-0 flex items-center justify-center text-slate-300 text-[10px] font-mono uppercase tracking-widest">
          No training data
        </div>
      {/if}
    </div>

    <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
      <span>EPOCH: {epoch}</span>
      <span>LOSS: {history[history.length - 1]?.loss.toFixed(6) || '0.000000'}</span>
    </div>
  </div>
</section>
