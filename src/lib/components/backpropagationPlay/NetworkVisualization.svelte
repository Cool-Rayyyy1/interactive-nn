<script lang="ts">
  import type { TrainingStep, NeuronValues } from '$lib/types';
  import { cn } from '$lib/utils';
  import { WEIGHT_NOTATION, NEURON_NOTATION } from '$lib/hooks/useNeuralNetwork.svelte';

  interface Props {
    weights: Record<string, number>;
    biases: Record<string, number>;
    neuronValues: Record<string, NeuronValues>;
    activeElement: string | null;
    step: TrainingStep;
    target: number;
  }

  let {
    weights,
    biases,
    neuronValues,
    activeElement,
    step,
    target
  }: Props = $props();

  const layerX = [100, 300, 500, 700];
  const neuronY = {
    'i0': 125, 'i1': 375,
    'h1_0': 125, 'h1_1': 375,
    'h2_0': 125, 'h2_1': 375,
    'o0': 250
  };

  const getLayerIdx = (id: string) => {
    if (id.startsWith('i')) return 0;
    if (id.startsWith('h1')) return 1;
    if (id.startsWith('h2')) return 2;
    return 3;
  };

  function getSubscriptParts(text: string) {
    if (!text) return { base: '' };
    if (!text.includes('_')) return { base: text };
    const [base, sub] = text.split('_');
    const cleanSub = sub.replace(/[{}]/g, '');
    return { base, sub: cleanSub };
  }
</script>

<div class="w-full flex justify-center items-center" id="network-visualization">
  <svg width="73%" height="100%" viewBox="120 0 600 500" class="overflow-visible max-w-4xl">
    <!-- Connections -->
    {#each Object.entries(weights) as [key, weight]}
      {@const [fromId, toId] = key.split('-')}
      {@const x1 = layerX[getLayerIdx(fromId)]}
      {@const y1 = neuronY[fromId as keyof typeof neuronY]}
      {@const x2 = layerX[getLayerIdx(toId)]}
      {@const y2 = neuronY[toId as keyof typeof neuronY]}
      
      {@const isUpdating = activeElement === key}
      {@const isForwardActive = step === 'forward' && activeElement === toId}
      {@const isBackwardActive = step === 'backward' && activeElement === fromId}

      {@const fromIdx = parseInt(fromId.slice(-1))}
      {@const toIdx = parseInt(toId.slice(-1))}
      {@const isDiagonal = fromIdx !== toIdx}
      {@const t = isDiagonal ? (fromIdx < toIdx ? 0.25 : 0.75) : 0.5}
      {@const lx = x1 + (x2 - x1) * t}
      {@const ly = y1 + (y2 - y1) * t}
      {@const offset = isDiagonal ? (fromIdx < toIdx ? -12 : 12) : -15}
      {@const notation = WEIGHT_NOTATION[key] || ''}
      {@const parts = getSubscriptParts(notation)}
      
      <g>
        <line 
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={weight > 0 ? '#141414' : '#F27D26'}
          stroke-width={Math.abs(weight) * 4 + 1.5}
          stroke-opacity={isUpdating || isForwardActive || isBackwardActive ? 1 : 0.25}
          class="transition-all duration-500"
        />
        
        {#if isForwardActive}
          <!-- Key for trigger re-mounting of animate elements -->
          {#key activeElement}
            <circle r="5" fill="#F27D26">
              <animate attributeName="cx" from={String(x1)} to={String(x2)} dur="0.8s" repeatCount="1" fill="freeze" />
              <animate attributeName="cy" from={String(y1)} to={String(y2)} dur="0.8s" repeatCount="1" fill="freeze" />
            </circle>
          {/key}
        {/if}

        {#if isBackwardActive}
          {#key activeElement}
            <circle r="5" fill="#F27D26">
              <animate attributeName="cx" from={String(x2)} to={String(x1)} dur="0.8s" repeatCount="1" fill="freeze" />
              <animate attributeName="cy" from={String(y2)} to={String(y1)} dur="0.8s" repeatCount="1" fill="freeze" />
            </circle>
          {/key}
        {/if}

        <!-- Weight Notation -->
        <g>
          <text 
            x={lx} y={ly + offset} 
            text-anchor="middle" 
            stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round"
            class="text-[14px] font-mono font-bold select-none opacity-90"
          >
            {#if parts.sub}
              {parts.base}<tspan baseline-shift="sub" font-size="75%">{parts.sub}</tspan>
            {:else}
              {parts.base}
            {/if}
          </text>
          <text 
            x={lx} y={ly + offset} 
            text-anchor="middle" 
            class={cn(
              "text-[14px] font-mono select-none transition-all duration-300",
              isUpdating ? 'fill-[#F27D26] font-bold' : 'fill-[#141414]/80 font-bold'
            )}
          >
            {#if parts.sub}
              {parts.base}<tspan baseline-shift="sub" font-size="75%">{parts.sub}</tspan>
            {:else}
              {parts.base}
            {/if}
          </text>
        </g>
      </g>
    {/each}

    <!-- Neurons -->
    {#each Object.entries(neuronValues) as [id, { val, error }]}
      {@const x = layerX[getLayerIdx(id)]}
      {@const y = neuronY[id as keyof typeof neuronY]}
      {@const isInput = id.startsWith('i')}
      {@const isOutput = id.startsWith('o')}
      {@const isActive = activeElement === id}
      {@const notation = NEURON_NOTATION[id] || ''}
      {@const parts = getSubscriptParts(notation)}

      <g>
        <circle
          class="transition-all duration-300 shadow-[1px_1px_0px_#141414]"
          cx={x} cy={y}
          r="35"
          fill="#FFFFFF"
          stroke={isActive ? '#F27D26' : '#141414'}
          stroke-width={isActive ? 3 : 1.5}
        />
        <text 
          x={x} y={y + 5} 
          text-anchor="middle" 
          class={cn(
            "text-[14px] font-mono font-bold select-none transition-all duration-300",
            isActive ? 'fill-[#F27D26]' : 'fill-[#141414]'
          )}
        >
          {val.toFixed(3)}
        </text>

        {#if !isInput && (error !== 0 || step === 'backward')}
          <text 
            x={x} y={y + 54} 
            text-anchor="middle" 
            class={cn(
              "text-[11px] font-mono font-bold select-none",
              isActive && step === 'backward' ? 'fill-[#F27D26]' : 'fill-[#141414]/60'
            )}
          >
            {isOutput ? 'L:' : '∇:'}{isOutput ? (Math.pow(target - val, 2)).toFixed(4) : error.toFixed(4)}
          </text>
        {/if}

        <text 
          x={x} y={y - 50} 
          text-anchor="middle" 
          class="font-serif italic text-[#141414]/60 text-[15px] lowercase"
        >
          {#if parts.sub}
            {parts.base}<tspan baseline-shift="sub" font-size="75%">{parts.sub}</tspan>
          {:else}
            {parts.base}
          {/if}
        </text>
      </g>
    {/each}

    <!-- Target Marker -->
    <g transform={`translate(${layerX[3] + 80}, ${neuronY['o0']})`}>
      <rect x="-25" y="-25" width="50" height="50" fill="white" stroke="#141414" stroke-width="1.5" stroke-dasharray="3 1.5" />
      <text text-anchor="middle" y="5" class="text-[14px] font-mono font-bold fill-[#F27D26]">
        {target.toFixed(2)}
      </text>
      <text text-anchor="middle" y="-40" class="tech-label text-[#141414]/60 italic font-serif text-[13px] lowercase">target (y)</text>
    </g>
  </svg>
</div>
