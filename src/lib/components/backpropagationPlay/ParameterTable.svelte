<script lang="ts">
  import { WEIGHT_NOTATION, BIAS_NOTATION } from '$lib/hooks/useNeuralNetwork.svelte';
  import { cn } from '$lib/utils';
  import Latex from './Latex.svelte';

  interface Props {
    weights: Record<string, number>;
    biases: Record<string, number>;
    activeElement: string | null;
  }

  let { weights, biases, activeElement }: Props = $props();
</script>

<section class="bg-white overflow-hidden" id="parameter-table">
  <div class="tech-header bg-[#f5f5f5] border-b border-black/30 p-3 flex justify-between items-center">
    <h2 class="tech-label text-xs uppercase font-bold tracking-wider ">Parameter Registry</h2>
    <span class="text-[9px] text-[#141414]/60  font-bold">REG_DUMP (FLOAT64)</span>
  </div>
  <div class="grid grid-cols-2 divide-x divide-[#141414]">
    <div class="p-4 bg-white">
      <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#141414]/60 mb-3 ">Weights (W)</h3>
      <div class="space-y-1">
        {#each Object.entries(WEIGHT_NOTATION) as [key, notation]}
          <div 
            class={cn(
              "flex justify-between items-center px-2 py-1.5 text-[11px]  transition-all border-l-2",
              activeElement === key 
                ? "bg-[#E4E3E0] border-[#F27D26] text-[#F27D26] font-bold" 
                : "text-[#141414] border-transparent"
            )}
          >
            <span><Latex math={notation} /></span>
            <span class={cn("tabular-nums", activeElement === key ? "text-[#F27D26]" : "text-[#141414]")}>
              {(weights[key] ?? 0).toFixed(4)}
            </span>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="p-4 bg-white">
      <h3 class="text-[10px] font-bold uppercase tracking-widest text-[#141414]/60 mb-3 ">Biases (B)</h3>
      <div class="space-y-1">
        {#each Object.entries(BIAS_NOTATION) as [key, notation]}
          <div 
            class={cn(
              "flex justify-between items-center px-2 py-1.5 text-[11px]  transition-all border-l-2",
              activeElement === key 
                ? "bg-[#E4E3E0] border-[#F27D26] text-[#F27D26] font-bold" 
                : "text-[#141414] border-transparent"
            )}
          >
            <span><Latex math={notation}/></span>
            <span class={cn("tabular-nums", activeElement === key ? "text-[#F27D26]" : "text-[#141414]")}>
              {(biases[key] ?? 0).toFixed(4)}
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
