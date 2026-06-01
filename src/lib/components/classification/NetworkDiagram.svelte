<script lang="ts">
  import { Network } from 'lucide-svelte';

  // Svelte 5 runes for props
  let { 
    networkState, 
    mode, 
    selectedElement, 
    onselectElement 
  }: {
    networkState: any;
    mode: 'auto' | 'manual';
    selectedElement: {
      type: 'weight' | 'bias';
      layer: number;
      from?: number;
      to?: number;
      index?: number;
    } | null;
    onselectElement: (element: any | null) => void;
  } = $props();
</script>

<div class="flex-1 border border-[#141414] bg-white relative overflow-hidden group">
  <div class="absolute top-4 left-4 z-10">
    <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
      <Network class="w-4 h-4" /> Network Architecture
    </h2>
  </div>
  
  <svg class="w-full h-full" aria-label="Neural Network Diagram">
    {#if networkState}
      <!-- Pass 1: Connection Lines -->
      {#each networkState.layers as layerSize, lIdx}
        {#if lIdx < networkState.layers.length - 1}
          {#each Array.from({ length: layerSize }) as _, fromIdx}
            {#each Array.from({ length: networkState.layers[lIdx + 1] }) as _, toIdx}
              {@const weight = networkState.weights[lIdx][toIdx][fromIdx]}
              {@const absWeight = Math.min(1, Math.abs(weight))}
              
              <!-- Saturate/Lighten paths to increase contrast -->
              {@const color = weight > 0 
                ? `hsl(25, ${30 + absWeight * 65}%, ${85 - absWeight * 35}%)`
                : `hsl(0, 0%, ${85 - absWeight * 77}%)`}
              
              {@const x1 = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
              {@const y1 = ((fromIdx + 0.5) / layerSize) * 80 + 10}
              {@const x2 = ((lIdx + 1) / (networkState.layers.length - 1)) * 80 + 10}
              {@const y2 = ((toIdx + 0.5) / networkState.layers[lIdx + 1]) * 80 + 10}

              {@const isSelected = selectedElement?.type === 'weight' &&
                selectedElement.layer === lIdx &&
                selectedElement.from === fromIdx &&
                selectedElement.to === toIdx}

              <g>
                {#if isSelected}
                  <line
                    x1="{x1}%"
                    y1="{y1}%"
                    x2="{x2}%"
                    y2="{y2}%"
                    stroke="#F27D26"
                    stroke-width="5"
                    stroke-dasharray="3 2"
                    class="opacity-70"
                  />
                {/if}
                <line
                  x1="{x1}%"
                  y1="{y1}%"
                  x2="{x2}%"
                  y2="{y2}%"
                  stroke={isSelected ? '#F27D26' : color}
                  stroke-width={isSelected ? 2.5 : 1.5}
                  class="transition-all duration-150"
                />
              </g>
            {/each}
          {/each}
        {/if}
      {/each}

      <!-- Pass 2: Neurons -->
      {#each networkState.layers as layerSize, lIdx}
        {#each Array.from({ length: layerSize }) as _, nIdx}
          {@const x = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
          {@const y = ((nIdx + 0.5) / layerSize) * 80 + 10}
          {@const bias = lIdx > 0 ? networkState.biases[lIdx - 1][nIdx] : 0}
          {@const biasColor = bias > 0 ? '#F27D26' : '#141414'}
          {@const biasOpacity = Math.min(1, Math.abs(bias) * 2)}

          {@const isBiasSelected = selectedElement?.type === 'bias' &&
            selectedElement.layer === lIdx - 1 &&
            selectedElement.index === nIdx}

          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <g 
            onclick={() => {
              if (mode === 'manual' && lIdx > 0) {
                onselectElement({
                  type: 'bias',
                  layer: lIdx - 1,
                  index: nIdx
                });
              }
            }}
            class={mode === 'manual' && lIdx > 0 ? 'cursor-pointer' : ''}
          >
            <!-- Pulse glowing highlight for selected bias -->
            {#if isBiasSelected}
              <circle
                cx="{x}%"
                cy="{y}%"
                r="16"
                fill="none"
                stroke="#F27D26"
                stroke-width="2"
                class="animate-ping [animation-duration:1.5s]"
              />
            {/if}
            <circle
              cx="{x}%"
              cy="{y}%"
              r="12"
              fill="white"
              stroke={isBiasSelected ? '#F27D26' : '#141414'}
              stroke-width={isBiasSelected ? '2.5' : '2'}
            />
            {#if lIdx > 0}
              <circle
                cx="{x}%"
                cy="{y}%"
                r="6"
                fill={biasColor}
                fill-opacity={biasOpacity}
              />
            {/if}
            <text 
              x="{x}%" 
              y="{y}%" 
              dy="4"
              text-anchor="middle" 
              class="text-[11px] font-mono pointer-events-none font-bold fill-[#141414]"
            >
              {lIdx === 0 ? (nIdx === 0 ? 'X' : 'Y') : (lIdx === networkState.layers.length - 1 ? (nIdx === 0 ? 'A' : 'B') : '')}
            </text>
          </g>
        {/each}
      {/each}

      <!-- Pass 3: Labels (Weights and Biases) on top -->
      {#each networkState.layers as layerSize, lIdx}
        <g>
          <!-- Weight Labels (Hover and Selection Targets) -->
          {#if lIdx < networkState.layers.length - 1}
            {#each Array.from({ length: layerSize }) as _, fromIdx}
              {#each Array.from({ length: networkState.layers[lIdx + 1] }) as _, toIdx}
                {@const weight = networkState.weights[lIdx][toIdx][fromIdx]}
                {@const x1 = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
                {@const y1 = ((fromIdx + 0.5) / layerSize) * 80 + 10}
                {@const x2 = ((lIdx + 1) / (networkState.layers.length - 1)) * 80 + 10}
                {@const y2 = ((toIdx + 0.5) / networkState.layers[lIdx + 1]) * 80 + 10}

                {@const isWeightSelected = selectedElement?.type === 'weight' &&
                  selectedElement.layer === lIdx &&
                  selectedElement.from === fromIdx &&
                  selectedElement.to === toIdx}

                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <g 
                  class="group cursor-pointer"
                  onclick={() => {
                    if (mode === 'manual') {
                      onselectElement({
                        type: 'weight',
                        layer: lIdx,
                        from: fromIdx,
                        to: toIdx
                      });
                    }
                  }}
                >
                  <!-- Thick element helper for user hover trigger -->
                  <line
                    x1="{x1}%"
                    y1="{y1}%"
                    x2="{x2}%"
                    y2="{y2}%"
                    stroke="rgba(0,0,0,0)"
                    stroke-width="16"
                    class="cursor-pointer"
                    pointer-events="stroke"
                  />
                  <g 
                    class="transition-all duration-200 {
                      isWeightSelected 
                        ? 'opacity-100 scale-110' 
                        : (mode === 'manual' 
                          ? 'opacity-100 hover:scale-110' 
                          : 'opacity-0 group-hover:opacity-100')
                    }"
                    style="transform-box: fill-box; transform-origin: center;"
                  >
                    <rect
                      x="{(x1 + x2) / 2}%"
                      y="{(y1 + y2) / 2}%"
                      width="34"
                      height="16"
                      fill={isWeightSelected ? '#F27D26' : 'white'}
                      fill-opacity="0.95"
                      stroke={isWeightSelected ? '#F27D26' : (mode === 'manual' ? '#F27D26' : '#141414')}
                      stroke-width={isWeightSelected ? "2" : (mode === 'manual' ? "1" : "0.75")}
                      stroke-dasharray={mode === 'manual' && !isWeightSelected ? '3 1' : 'none'}
                      rx="3.5"
                      transform="translate(-17, -8)"
                    />
                    <text
                      x="{(x1 + x2) / 2}%"
                      y="{(y1 + y2) / 2}%"
                      dy="0"
                      text-anchor="middle"
                      dominant-baseline="central"
                      class="text-[10px] font-mono font-bold {
                        isWeightSelected ? 'fill-white' : 'fill-[#141414]'
                      }"
                    >
                      {weight.toFixed(2)}
                    </text>
                  </g>
                </g>
              {/each}
            {/each}
          {/if}

          <!-- Bias Labels -->
          {#if lIdx > 0}
            {#each Array.from({ length: layerSize }) as _, nIdx}
              {@const x = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
              {@const y = ((nIdx + 0.5) / layerSize) * 80 + 10}
              {@const bias = networkState.biases[lIdx - 1][nIdx]}

              {@const isBiasSelected = selectedElement?.type === 'bias' &&
                selectedElement.layer === lIdx - 1 &&
                selectedElement.index === nIdx}

              <text
                x="{x}%"
                y="{y}%"
                dy="-18"
                text-anchor="middle"
                class="text-[10px] font-mono font-bold pointer-events-none transition-all duration-200 {
                  isBiasSelected ? 'fill-[#141414] text-[11px] scale-110 font-extrabold' : 'fill-[#F27D26]'
                }"
              >
                {bias.toFixed(2)}
              </text>
            {/each}
          {/if}
        </g>
      {/each}
    {/if}
  </svg>
</div>
