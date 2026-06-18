<script lang="ts">
  import { Settings2, Minus, Plus } from 'lucide-svelte';

  // State / Callback interfaces
  let { 
    selectedElement, 
    networkState, 
    onadjustWeight, 
    onadjustBias, 
    onsetElementValue,
    onmanualTuneEnd
  }: {
    selectedElement: {
      type: 'weight' | 'bias';
      layer: number;
      from?: number;
      to?: number;
      index?: number;
    } | null;
    networkState: any;
    onadjustWeight: (delta: number) => void;
    onadjustBias: (delta: number) => void;
    onsetElementValue: (val: number) => void;
    onmanualTuneEnd: () => void;
  } = $props();
</script>

<section class="p-4 border border-[#141414] bg-white space-y-3 rounded-2xl " id="section-tuning">
  <h2 class="text-xs tracking-widest text-[#F27D26] flex items-center gap-2 font-bold">
    <Settings2 class="w-4 h-4" /> Tuning Console
  </h2>
  {#if selectedElement && networkState}
    <div class="space-y-3">
      <div class="text-[10px]  flex justify-between">
        <span class="opacity-50">Component:</span>
        <span class="font-bold text-[#F27D26]">
          {selectedElement.type}
        </span>
      </div>
      <div class="text-[10px]  flex justify-between border-b border-gray-100 pb-1.5">
        <span class="opacity-50">Coordinate:</span>
        {#if selectedElement.type === 'weight'}
          <span class="font-semibold">
            L{selectedElement.layer} N{selectedElement.from} → L{selectedElement.layer + 1} N{selectedElement.to}
          </span>
        {:else}
          <span class="font-semibold">
            L{selectedElement.layer + 1} Neuron {selectedElement.index}
          </span>
        {/if}
      </div>

      <div class="flex items-center justify-between bg-[#f5f5f5] p-2.5 border border-[#141414]/10 rounded-2xl">
        <span class="text-[10px]  opacity-50">Current Value:</span>
        <span class="text-[15px]  font-bold">
          {#if selectedElement.type === 'weight'}
            {networkState.weights[selectedElement.layer][selectedElement.to!][selectedElement.from!].toFixed(4)}
          {:else}
            {networkState.biases[selectedElement.layer][selectedElement.index!].toFixed(4)}
          {/if}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          onclick={() => {
            if (selectedElement?.type === 'weight') {
              onadjustWeight(-0.1);
            } else {
              onadjustBias(-0.1);
            }
          }}
          class="py-1.5 border border-[#141414] bg-white hover:bg-[#141414] hover:text-[#E4E3E0]  text-center transition-colors text-xs font-bold flex items-center justify-center gap-1 rounded-2xl"
        >
          <Minus class="w-3 h-3" /> 0.10
        </button>
        <button
          onclick={() => {
            if (selectedElement?.type === 'weight') {
              onadjustWeight(0.1);
            } else {
              onadjustBias(0.1);
            }
          }}
          class="py-1.5 border border-[#141414] bg-white hover:bg-[#141414] hover:text-[#E4E3E0]  text-center transition-colors text-xs font-bold flex items-center justify-center gap-1 rounded-2xl"
        >
          <Plus class="w-3 h-3" /> 0.10
        </button>
      </div>

      <div class="space-y-1 pt-1">
        <div class="flex justify-between text-[8px]  opacity-50 mb-1">
          <span>Min: -5.0</span>
          <span>Drag to Tune</span>
          <span>Max: +5.0</span>
        </div>
        <input
          type="range"
          min="-5"
          max="5"
          step="0.01"
          value={
            selectedElement.type === 'weight'
              ? networkState.weights[selectedElement.layer][selectedElement.to!][selectedElement.from!]
              : networkState.biases[selectedElement.layer][selectedElement.index!]
          }
          oninput={(e) => {
            const val = parseFloat((e.target as HTMLInputElement).value);
            onsetElementValue(val);
          }}
          onmouseup={onmanualTuneEnd}
          ontouchend={onmanualTuneEnd}
          class="w-full accent-[#F27D26] cursor-ew-resize"
        />
      </div>
    </div>
  {:else}
    <div class="p-3 bg-[#f5f5f5] border border-dashed border-[#141414]/20 text-center text-xs font-sans text-[#141414]/70 rounded-2xl ">
      Click any connection line or neuron in the diagram to activate manual weight dials.
    </div>
  {/if}
</section>
