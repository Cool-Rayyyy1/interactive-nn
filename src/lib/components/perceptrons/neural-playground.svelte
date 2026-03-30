<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    Play, 
    Pause, 
    RotateCcw, 
    Plus, 
    Minus, 
    Settings2, 
    Activity, 
    Network, 
    Zap,
    Info
  } from 'lucide-svelte';
    import { NeuralNetwork, type ActivationType, type LayerConfig } 
  from '$lib/networks/ml-engine';  import { fade, slide } from 'svelte/transition';

  interface DataPoint {
    x: number;
    y: number;
    label: number;
  }

  const MAX_LOSS_HISTORY = 100;

  let layers = $state<LayerConfig[]>([
    { neurons: 4, activation: 'relu' },
    { neurons: 4, activation: 'relu' }
  ]);
  let learningRate = $state(0.05);
  let isPlaying = $state(false);
  let epoch = $state(0);
  let lossHistory = $state<{ epoch: number; loss: number }[]>([]);
  let dataPoints = $state<DataPoint[]>([]);
  let networkState = $state<any>(null);

  let nn: NeuralNetwork | null = null;
  let requestHandle: number | null = null;
  let canvas: HTMLCanvasElement;

  onMount(() => {
    generateData();
    initNetwork();
  });

  $effect(() => {
    layers; // dependency
    initNetwork();
  });

  function generateData() {
    const points: DataPoint[] = [];
    for (let i = 0; i < 100; i++) {
      const r = Math.random() * 2 - 1;
      const theta = Math.random() * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const label = (x * x + y * y < 0.3) ? 1 : 0;
      points.push({ x, y, label });
    }
    dataPoints = points;
    epoch = 0;
    lossHistory = [];
  }

  function initNetwork() {
    const layerSizes = [2, ...layers.map(l => l.neurons), 2];
    const activations = layers.map(l => l.activation);
    nn = new NeuralNetwork(layerSizes, activations);
    nn.learningRate = learningRate;
    networkState = nn.getState();
  }

  function trainStep() {
    if (!nn) return;

    let totalLoss = 0;
    for (const p of dataPoints) {
      const target = p.label === 1 ? [0, 1] : [1, 0];
      totalLoss += nn.train([p.x, p.y], target);
    }
    
    const avgLoss = totalLoss / dataPoints.length;
    
    epoch += 1;
    const nextLoss = [...lossHistory, { epoch, loss: avgLoss }];
    lossHistory = nextLoss.slice(-MAX_LOSS_HISTORY);
    
    networkState = nn.getState();
    drawDecisionBoundary();

    if (isPlaying) {
      requestHandle = requestAnimationFrame(trainStep);
    }
  }

  $effect(() => {
    if (isPlaying) {
      requestHandle = requestAnimationFrame(trainStep);
    } else if (requestHandle) {
      cancelAnimationFrame(requestHandle);
    }
    return () => {
      if (requestHandle) cancelAnimationFrame(requestHandle);
    };
  });

  function drawDecisionBoundary() {
    if (!canvas || !nn) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < width; i += 2) {
      for (let j = 0; j < height; j += 2) {
        const x = (i / width) * 2 - 1;
        const y = (j / height) * 2 - 1;
        const { outputs } = nn.forward([x, y]);
        const prob = outputs[outputs.length - 1][1];

        const r = Math.floor(255 * prob);
        const b = Math.floor(255 * (1 - prob));
        const g = 100;

        for (let dx = 0; dx < 2; dx++) {
          for (let dy = 0; dy < 2; dy++) {
            const idx = ((j + dy) * width + (i + dx)) * 4;
            imageData.data[idx] = r;
            imageData.data[idx + 1] = g;
            imageData.data[idx + 2] = b;
            imageData.data[idx + 3] = 100;
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  $effect(() => {
    networkState;
    dataPoints;
    drawDecisionBoundary();
  });

  function addLayer() {
    if (layers.length < 3) {
      layers = [...layers, { neurons: 4, activation: 'relu' }];
    }
  }

  function removeLayer() {
    if (layers.length > 1) {
      layers = layers.slice(0, -1);
    }
  }

  function updateLayer(index: number, updates: Partial<LayerConfig>) {
    layers[index] = { ...layers[index], ...updates };
  }

  function togglePlay() {
    isPlaying = !isPlaying;
  }

  function reset() {
    isPlaying = false;
    initNetwork();
    epoch = 0;
    lossHistory = [];
  }

  let maxLoss = $derived(Math.max(...lossHistory.map(h => h.loss), 0.1));
</script>

<div class="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
  <!-- Header -->
  <header class="border-b border-[#141414] p-6 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-serif italic tracking-tight flex items-center gap-3">
        <Zap class="w-8 h-8 text-[#F27D26]" />
         ML Playground
      </h1>
      <p class="text-xs uppercase tracking-widest opacity-50 mt-1 font-mono">
        Interactive ML Playground • Binary Classification
      </p>
    </div>
    <div class="flex gap-4">
      <button 
        onclick={reset}
        class="p-3 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors"
        title="Reset Network"
      >
        <RotateCcw class="w-5 h-5" />
      </button>
      <button 
        onclick={togglePlay}
        class="px-8 py-3 border border-[#141414] flex items-center gap-2 transition-all {isPlaying ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414] hover:text-[#E4E3E0]'}"
      >
        {#if isPlaying}
          <Pause class="w-5 h-5" />
        {:else}
          <Play class="w-5 h-5" />
        {/if}
        <span class="font-mono uppercase tracking-wider">{isPlaying ? 'Stop' : 'Train'}</span>
      </button>
    </div>
  </header>

  <main class="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-100px)]">
    <aside class="lg:col-span-3 border-r border-[#141414] p-6 overflow-y-auto bg-[#E4E3E0]/50 backdrop-blur-sm">
      <div class="space-y-8">
        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2">
            <Settings2 class="w-4 h-4" /> Configuration
          </h2>
          
          <div class="space-y-6">
            <div>
              <label for="lr-input" class="text-sm font-serif italic block mb-2">Learning Rate: {learningRate.toFixed(3)}</label>
              <input 
                id="lr-input"
                type="range" 
                min="0.001" 
                max="0.5" 
                step="0.001" 
                bind:value={learningRate}
                oninput={() => { if (nn) nn.learningRate = learningRate; }}
                class="w-full accent-[#141414]"
              />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-serif italic">Hidden Layers</span>
                <div class="flex gap-2">
                  <button onclick={removeLayer} class="p-1 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"><Minus class="w-4 h-4" /></button>
                  <button onclick={addLayer} class="p-1 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]"><Plus class="w-4 h-4" /></button>
                </div>
              </div>

              <div class="space-y-3">
                {#each layers as layer, idx (idx)}
                  <div 
                    class="p-4 border border-[#141414] bg-white/50"
                    transition:slide
                  >
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-[10px] font-mono uppercase opacity-50">Layer {idx + 1}</span>
                      <div class="flex items-center gap-2">
                        <button 
                          onclick={() => updateLayer(idx, { neurons: Math.max(1, layer.neurons - 1) })}
                          class="w-6 h-6 border border-[#141414] flex items-center justify-center text-xs"
                        >-</button>
                        <span class="font-mono text-sm w-4 text-center">{layer.neurons}</span>
                        <button 
                          onclick={() => updateLayer(idx, { neurons: Math.min(8, layer.neurons + 1) })}
                          class="w-6 h-6 border border-[#141414] flex items-center justify-center text-xs"
                        >+</button>
                      </div>
                    </div>
                    <select 
                      bind:value={layer.activation}
                      onchange={() => updateLayer(idx, { activation: layer.activation })}
                      class="w-full bg-transparent border border-[#141414] p-2 text-xs font-mono uppercase"
                    >
                      <option value="relu">ReLU</option>
                      <option value="sigmoid">Sigmoid</option>
                      <option value="tanh">Tanh</option>
                    </select>
                  </div>
                {/each}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2">
            <Activity class="w-4 h-4" /> Stats
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 border border-[#141414] bg-white">
              <div class="text-[10px] font-mono uppercase opacity-50">Epoch</div>
              <div class="text-2xl font-serif italic">{epoch}</div>
            </div>
            <div class="p-4 border border-[#141414] bg-white">
              <div class="text-[10px] font-mono uppercase opacity-50">Loss</div>
              <div class="text-2xl font-serif italic">
                {lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].loss.toFixed(4) : '0.0000'}
              </div>
            </div>
          </div>
        </section>

        <section class="h-48">
          <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">Loss Curve</h2>
          <div class="h-full border border-[#141414] bg-white p-2 relative">
            <!-- Simple SVG Chart for Svelte -->
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={lossHistory.length > 1 
                  ? `M ${lossHistory.map((h, i) => `${(i / (lossHistory.length - 1)) * 100},${100 - (h.loss / maxLoss) * 100}`).join(' L ')}`
                  : ''}
                fill="none"
                stroke="#141414"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
              />
            </svg>
          </div>
        </section>
      </div>
    </aside>

    <div class="lg:col-span-6 border-r border-[#141414] p-6 flex flex-col gap-6 overflow-hidden">
      <div class="flex-1 border border-[#141414] bg-white relative overflow-hidden group">
        <div class="absolute top-4 left-4 z-10">
          <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
            <Network class="w-4 h-4" /> Network Architecture
          </h2>
        </div>
        
        <svg class="w-full h-full">
          {#if networkState}
            <!-- Pass 1: Connection Lines -->
            {#each networkState.layers as layerSize, lIdx}
              {#if lIdx < networkState.layers.length - 1}
                {#each Array.from({ length: layerSize }) as _, fromIdx}
                  {#each Array.from({ length: networkState.layers[lIdx + 1] }) as _, toIdx}
                    {@const weight = networkState.weights[lIdx][toIdx][fromIdx]}
                    {@const absWeight = Math.min(1, Math.abs(weight))}
                    {@const color = weight > 0 
                      ? `hsl(25, ${30 + absWeight * 65}%, ${85 - absWeight * 35}%)`
                      : `hsl(0, 0%, ${85 - absWeight * 77}%)`}
                    {@const x1 = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
                    {@const y1 = ((fromIdx + 0.5) / layerSize) * 80 + 10}
                    {@const x2 = ((lIdx + 1) / (networkState.layers.length - 1)) * 80 + 10}
                    {@const y2 = ((toIdx + 0.5) / networkState.layers[lIdx + 1]) * 80 + 10}
                    <line
                      x1="{x1}%"
                      y1="{y1}%"
                      x2="{x2}%"
                      y2="{y2}%"
                      stroke={color}
                      stroke-width="1.5"
                    />
                  {/each}
                {/each}
              {/if}
            {/each}

            {#each networkState.layers as layerSize, lIdx}
              {#each Array.from({ length: layerSize }) as _, nIdx}
                {@const x = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
                {@const y = ((nIdx + 0.5) / layerSize) * 80 + 10}
                {@const bias = lIdx > 0 ? networkState.biases[lIdx - 1][nIdx] : 0}
                {@const biasColor = bias > 0 ? '#F27D26' : '#141414'}
                {@const biasOpacity = Math.min(1, Math.abs(bias) * 2)}
                <g>
                  <circle
                    cx="{x}%"
                    cy="{y}%"
                    r="12"
                    fill="white"
                    stroke="#141414"
                    stroke-width="2"
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
                    class="text-[9px] font-mono pointer-events-none font-bold"
                    fill="#141414"
                  >
                    {lIdx === 0 ? (nIdx === 0 ? 'X' : 'Y') : (lIdx === networkState.layers.length - 1 ? (nIdx === 0 ? 'A' : 'B') : '')}
                  </text>
                </g>
              {/each}
            {/each}

            {#each networkState.layers as layerSize, lIdx}
              <g>
                {#if lIdx < networkState.layers.length - 1}
                  {#each Array.from({ length: layerSize }) as _, fromIdx}
                    {#each Array.from({ length: networkState.layers[lIdx + 1] }) as _, toIdx}
                      {@const weight = networkState.weights[lIdx][toIdx][fromIdx]}
                      {@const x1 = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
                      {@const y1 = ((fromIdx + 0.5) / layerSize) * 80 + 10}
                      {@const x2 = ((lIdx + 1) / (networkState.layers.length - 1)) * 80 + 10}
                      {@const y2 = ((toIdx + 0.5) / networkState.layers[lIdx + 1]) * 80 + 10}
                      <g class="group">
                        <line
                          x1="{x1}%"
                          y1="{y1}%"
                          x2="{x2}%"
                          y2="{y2}%"
                          stroke="transparent"
                          stroke-width="15"
                          class="cursor-pointer"
                        />
                        <g class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <rect
                            x="{(x1 + x2) / 2}%"
                            y="{(y1 + y2) / 2}%"
                            width="24"
                            height="12"
                            fill="white"
                            fill-opacity="0.9"
                            stroke="#141414"
                            stroke-width="0.5"
                            rx="2"
                            transform="translate(-12, -6)"
                          />
                          <text
                            x="{(x1 + x2) / 2}%"
                            y="{(y1 + y2) / 2}%"
                            dy="1"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            class="text-[7px] font-mono fill-[#141414] font-bold"
                          >
                            {weight.toFixed(2)}
                          </text>
                        </g>
                      </g>
                    {/each}
                  {/each}
                {/if}

                {#if lIdx > 0}
                  {#each Array.from({ length: layerSize }) as _, nIdx}
                    {@const x = (lIdx / (networkState.layers.length - 1)) * 80 + 10}
                    {@const y = ((nIdx + 0.5) / layerSize) * 80 + 10}
                    {@const bias = networkState.biases[lIdx - 1][nIdx]}
                    <text
                      x="{x}%"
                      y="{y}%"
                      dy="-16"
                      text-anchor="middle"
                      class="text-[7px] font-mono fill-[#F27D26] font-bold pointer-events-none"
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

      <div class="h-1/3 border border-[#141414] bg-[#141414] text-[#E4E3E0] p-6 font-mono text-xs overflow-y-auto">
        <div class="flex items-center gap-2 mb-2 opacity-50">
          <Info class="w-4 h-4" /> <span>System Logs</span>
        </div>
        <p class="mb-1 text-[#F27D26]">{">> "}Initializing neural network with {layers.length} hidden layers...</p>
        <p class="mb-1">{">> "}Dataset: Binary classification (Circular boundary)</p>
        <p class="mb-1">{">> "}Activation: {layers.map(l => l.activation).join(', ')}</p>
        <p class="mb-1">{">> "}Learning rate set to {learningRate}</p>
        {#if isPlaying}
          <p class="animate-pulse">{">> "}Training in progress... Epoch: {epoch}</p>
        {/if}
      </div>
    </div>

    <aside class="lg:col-span-3 p-6 flex flex-col gap-6">
      <div class="flex-1 border border-[#141414] bg-white relative flex flex-col">
        <div class="p-4 border-b border-[#141414] flex justify-between items-center">
          <h2 class="text-xs font-mono uppercase tracking-widest opacity-50">Decision Space</h2>
          <button 
            onclick={generateData}
            class="text-[10px] uppercase font-mono hover:underline"
          >Regenerate Data</button>
        </div>
        
        <div class="flex-1 relative m-4 border border-[#141414]/10">
          <canvas 
            bind:this={canvas}
            width={400} 
            height={400} 
            class="w-full h-full absolute inset-0"
          ></canvas>
          <svg class="w-full h-full absolute inset-0 pointer-events-none">
            {#each dataPoints as p, i}
              <circle 
                cx="{(p.x + 1) * 50}%"
                cy="{(p.y + 1) * 50}%"
                r="4"
                fill={p.label === 1 ? '#F27D26' : '#141414'}
                stroke="white"
                stroke-width="1"
              />
            {/each}
          </svg>
        </div>

        <div class="p-4 border-t border-[#141414] bg-[#E4E3E0]/30">
          <div class="flex justify-between items-center text-[10px] font-mono uppercase opacity-50 mb-2">
            <span>Legend</span>
          </div>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-[#F27D26] rounded-full border border-white"></div>
              <span class="text-[10px] font-mono">Class A</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-[#141414] rounded-full border border-white"></div>
              <span class="text-[10px] font-mono">Class B</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </main>

  <footer class="h-[40px] border-t border-[#141414] bg-[#141414] text-[#E4E3E0] px-6 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
    <div class="flex gap-6">
      <span>Status: {isPlaying ? 'Training' : 'Idle'}</span>
      <span>Engine: Custom Backprop</span>
    </div>
    <div>
      Frank Zhang • Machine Learning Visualizer v1.0
    </div>
  </footer>
</div>

<style>
  
</style>
