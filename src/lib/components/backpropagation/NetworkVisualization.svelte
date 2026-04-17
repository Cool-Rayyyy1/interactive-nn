<script lang="ts">
  import { tweened } from 'svelte/motion';
  import { cubicInOut } from 'svelte/easing';
  import {NEURON_NOTATION} from "$lib/store/network.svelte"
  import {WEIGHT_NOTATION} from "$lib/store/network.svelte"
  import type { NeuronValues, TrainingStep } from '$lib/types';

  let { 
  weights, 
  biases, 
  neuronValues, 
  activeElement, 
  step, 
  target 
} = $props<{
  weights: Record<string, number>;
  biases: Record<string, number>; 
  neuronValues: Record<string, NeuronValues>;
  activeElement: string | null;
  step: TrainingStep;
  target: number;
}>();

  const layerX = [100, 300, 500, 700];
  const neuronY: Record<string, number> = {
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

  // Flow animation state
  let flowSphere = $state<{ x: number, y: number, color: string, active: boolean }>({
    x: 0, y: 0, color: '#6366f1', active: false
  });

  // Watch for forward/backward changes to trigger pulse/flow
  $effect(() => {
    if (step === 'forward' && activeElement && activeElement.startsWith('h')) {
      // Find source
      // This is simplified, for real flow we'd need to know which connection is active
    }
  });
</script>

<div class="w-full flex justify-center items-center py-4">
  <svg width="100%" height="100%" viewBox="0 0 800 500" class="overflow-visible max-w-4xl">
    {#each Object.entries(weights) as [key, weight]}
      {@const [fromId, toId] = key.split('-')}
      {@const x1 = layerX[getLayerIdx(fromId)]}
      {@const y1 = neuronY[fromId]}
      {@const x2 = layerX[getLayerIdx(toId)]}
      {@const y2 = neuronY[toId]}
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
      {@const notation = WEIGHT_NOTATION[key]}
      {@const w = weight as number}
      
      
      <g>
        <line 
          {x1} {y1} {x2} {y2}
          stroke={w > 0 ? '#6366f1' : '#f43f5e'}
          stroke-width={Math.abs(w) * 4 + 1}
          stroke-opacity={isUpdating || isForwardActive || isBackwardActive ? 1 : 0.15}
          class="transition-all duration-500"
        />
        
        {#if isForwardActive}
           <circle r="4" fill="#6366f1">
             <animate attributeName="cx" from={x1} to={x2} dur="0.8s" repeatCount="1" fill="freeze" />
             <animate attributeName="cy" from={y1} to={y2} dur="0.8s" repeatCount="1" fill="freeze" />
           </circle>
        {/if}

        {#if isBackwardActive}
           <circle r="4" fill="#f43f5e">
             <animate attributeName="cx" from={x2} to={x1} dur="0.8s" repeatCount="1" fill="freeze" />
             <animate attributeName="cy" from={y2} to={y1} dur="0.8s" repeatCount="1" fill="freeze" />
           </circle>
        {/if}

        <!-- Weight Notation -->
        <g>
          <text 
            x={lx} y={ly + offset} 
            text-anchor="middle" 
            stroke="white" stroke-width="4" stroke-linejoin="round"
            class="text-[16px] font-mono font-bold select-none opacity-80"
          >
            {#if notation.includes('_')}
              {notation.split('_')[0]}<tspan baseline-shift="sub" font-size="75%">{notation.split('_')[1].replace(/[{}]/g, '')}</tspan>
            {:else}
              {notation}
            {/if}
          </text>
          <text 
            x={lx} y={ly + offset} 
            text-anchor="middle" 
            class="text-[16px] font-mono select-none transition-all duration-300 {isUpdating ? 'fill-amber-600 font-bold' : 'fill-slate-600 font-bold'}"
          >
             {#if notation.includes('_')}
              {notation.split('_')[0]}<tspan baseline-shift="sub" font-size="75%">{notation.split('_')[1].replace(/[{}]/g, '')}</tspan>
            {:else}
              {notation}
            {/if}
          </text>
        </g>
      </g>
    {/each}

    {#each Object.entries(neuronValues) as [id, neuron]}
       {@const x = layerX[getLayerIdx(id)]}
       {@const y = neuronY[id]}
       {@const isInput = id.startsWith('i')}
       {@const isOutput = id.startsWith('o')}
       {@const isActive = activeElement === id}
       {@const notation = NEURON_NOTATION[id]}
        {@const { val, error } = neuron as NeuronValues}

       

       <g>
         <circle
           class="transition-all duration-300"
           cx={x} cy={y}
           r="35"
           fill={isInput ? '#ffffff' : isOutput ? '#f8fafc' : '#ffffff'}
           stroke={isActive ? '#f59e0b' : '#6366f1'}
           stroke-width={isActive ? 4 : 1.5}
         />
         <text 
           x={x} y={y + 5} 
           text-anchor="middle" 
           class="text-[14px] font-mono font-bold select-none transition-all duration-300 {isActive ? 'fill-amber-700' : 'fill-slate-900'}"
         >
           {val.toFixed(3)}
         </text>

         {#if !isInput && (error !== 0 || step === 'backward')}
           <text 
             x={x} y={y + 55} 
             text-anchor="middle" 
             class="text-[13px] font-mono font-bold select-none {isActive && step === 'backward' ? 'fill-rose-600' : 'fill-rose-400'}"
           >
             {isOutput ? 'L:' : '∇:'}{isOutput ? (Math.pow(target - val, 2)).toFixed(4) : error.toFixed(4)}
           </text>
         {/if}

         <text 
           x={x} y={y - 52} 
           text-anchor="middle" 
           class="tech-label text-slate-400 font-serif italic text-[16px]"
         >
            {#if notation.includes('_')}
              {notation.split('_')[0]}<tspan baseline-shift="sub" font-size="75%">{notation.split('_')[1].replace(/[{}]/g, '')}</tspan>
            {:else}
              {notation}
            {/if}
         </text>
       </g>
    {/each}

    <g transform="translate({layerX[3] + 80}, {neuronY['o0']})">
      <rect x="-25" y="-25" width="50" height="50" fill="white" stroke="#6366f1" stroke-dasharray="2 2" />
      <text text-anchor="middle" y="5" class="text-[14px] font-mono font-bold fill-indigo-600">
        {target.toFixed(2)}
      </text>
      <text text-anchor="middle" y="-40" class="tech-label text-slate-400 italic text-[14px]">y</text>
    </g>
  </svg>
</div>
