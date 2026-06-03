<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { 
    Play, 
    Pause, 
    RotateCcw, 
    Plus, 
    Minus, 
    Settings2, 
    Activity, 
    Zap,
    Info
  } from 'lucide-svelte';
  import { NeuralNetwork, type ActivationType, type LayerConfig } from '$lib/networks/ml-engine';
  import LossCurve from '$lib/components/classification/LossCurve.svelte';
  import TuningConsole from '$lib/components/classification/TuningConsole.svelte';
  import NetworkDiagram from '$lib/components/classification/NetworkDiagram.svelte';
  import DecisionSpace from '$lib/components/classification/DecisionSpace.svelte';

  interface DataPoint {
    x: number;
    y: number;
    label: number; // 0 or 1
  }

  const GRID_SIZE = 40;
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

  // Custom states for Manual Weight Adjustments
  let mode = $state<'auto' | 'manual'>('auto');
  let selectedElement = $state<{
    type: 'weight' | 'bias';
    layer: number;
    from?: number;
    to?: number;
    index?: number;
  } | null>(null);

  // Normal references / internal states
  let nnRef = $state.raw<NeuralNetwork | null>(null);
  let timerId: any = null;

  // --- Calculation Helpers ---
  const calculateCurrentMSE = (nn: NeuralNetwork | null, points: DataPoint[]) => {
    if (!nn || points.length === 0) return 0;
    let sumSq = 0;
    for (const p of points) {
      const { outputs } = nn.forward([p.x, p.y]);
      const ypred = outputs[outputs.length - 1][1]; // probability of class 1
      sumSq += (ypred - p.label) * (ypred - p.label);
    }
    return sumSq / points.length;
  };

  // Track current Loss via reactive state
  let currentLoss = $state(0);

  // --- Manual Adjustment Triggers ---
  const adjustWeight = (delta: number) => {
    if (!nnRef || !selectedElement || selectedElement.type !== 'weight') return;
    const { layer, from, to } = selectedElement;
    if (from === undefined || to === undefined) return;
    
    nnRef.weights[layer][to][from] += delta;
    nnRef.weights[layer][to][from] = Math.max(-10, Math.min(10, nnRef.weights[layer][to][from]));
    
    networkState = nnRef.getState();
    
    currentLoss = calculateCurrentMSE(nnRef, dataPoints);
    recordManualLossEntry(currentLoss);
  };

  const adjustBias = (delta: number) => {
    if (!nnRef || !selectedElement || selectedElement.type !== 'bias') return;
    const { layer, index } = selectedElement;
    if (index === undefined) return;
    
    nnRef.biases[layer][index] += delta;
    nnRef.biases[layer][index] = Math.max(-10, Math.min(10, nnRef.biases[layer][index]));
    
    networkState = nnRef.getState();
    
    currentLoss = calculateCurrentMSE(nnRef, dataPoints);
    recordManualLossEntry(currentLoss);
  };

  const setElementValue = (val: number) => {
    if (!nnRef || !selectedElement) return;
    const clamped = Math.max(-10, Math.min(10, val));
    if (selectedElement.type === 'weight') {
      const { layer, from, to } = selectedElement;
      if (from === undefined || to === undefined) return;
      nnRef.weights[layer][to][from] = clamped;
    } else {
      const { layer, index } = selectedElement;
      if (index === undefined) return;
      nnRef.biases[layer][index] = clamped;
    }
    networkState = nnRef.getState();
    currentLoss = calculateCurrentMSE(nnRef, dataPoints);
  };

  const recordManualLossEntry = (lossVal: number) => {
    const lastPoint = lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].epoch : 0;
    const next = [...lossHistory, { epoch: lastPoint + 1, loss: lossVal }];
    lossHistory = next.slice(-MAX_LOSS_HISTORY);
  };

  // --- Generator & Initialization ---
  const generateData = () => {
    const points: DataPoint[] = [];
    // Circle dataset
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
    
    if (nnRef) {
      currentLoss = calculateCurrentMSE(nnRef, points);
      lossHistory = [{ epoch: 0, loss: currentLoss }];
    } else {
      currentLoss = 0;
      lossHistory = [];
    }
    selectedElement = null;
  };

  const initNetwork = () => {
    const layerSizes = [2, ...layers.map(l => l.neurons), 2];
    const activations = layers.map(l => l.activation);
    nnRef = new NeuralNetwork(layerSizes, activations);
    nnRef.learningRate = learningRate;
    networkState = nnRef.getState();
    
    currentLoss = calculateCurrentMSE(nnRef, dataPoints);
    lossHistory = [{ epoch: 0, loss: currentLoss }];
    selectedElement = null;
  };

  // --- Svelte 5 Hooks / Lifecycle effects ---
  // Run once on mount to mock standard setup
  onMount(() => {
    generateData();
  });

  // Re-run init when layers list changes
  $effect(() => {
    // track layers array
    const _ = layers;
    untrack(() => {
      initNetwork();
    });
  });

  // --- Training Loop ---
  const trainLoop = () => {
    if (!isPlaying || mode === 'manual' || !nnRef) return;

    // Train for 15 epochs in a single loop step
    let localEpoch = epoch;
    let finalLoss = currentLoss;
    for (let step = 0; step < 15; step++) {
      for (const p of dataPoints) {
        const target = p.label === 1 ? [0, 1] : [1, 0];
        nnRef.train([p.x, p.y], target);
      }
      finalLoss = calculateCurrentMSE(nnRef, dataPoints);
      localEpoch += 1;
    }

    currentLoss = finalLoss;
    epoch = localEpoch;

    const next = [...lossHistory, { epoch: epoch, loss: finalLoss }];
    lossHistory = next.slice(-MAX_LOSS_HISTORY);
    networkState = nnRef.getState();

    // Schedule next loop with a tiny delay to yield the event loop
    if (isPlaying) {
      timerId = setTimeout(trainLoop, 45);
    }
  };

  // Watch isPlaying & mode to start/stop the loop
  $effect(() => {
    if (isPlaying && mode !== 'manual') {
      timerId = setTimeout(trainLoop, 10);
    } else {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  });

  // --- Handlers ---
  const addLayer = () => {
    if (layers.length < 3) {
      layers = [...layers, { neurons: 4, activation: 'relu' }];
    }
  };

  const removeLayer = () => {
    if (layers.length > 1) {
      layers = layers.slice(0, -1);
    }
  };

  const updateLayer = (index: number, updates: Partial<LayerConfig>) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], ...updates };
    layers = newLayers;
  };

  const togglePlay = () => {
    isPlaying = !isPlaying;
  };

  const reset = () => {
    isPlaying = false;
    initNetwork();
    epoch = 0;
    lossHistory = [];
  };
</script>

<div class="min-h-screen text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
  <!-- Header -->
  <header class="border-b border-[#141414] p-6 flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-sans font-bold tracking-tight flex items-center gap-3 animate-fade-in">
        <Zap class="w-8 h-8 text-[#F27D26]" />
        Neural Vision
      </h1>
      <p class="text-xs uppercase tracking-widest opacity-50 mt-1 ">
        Interactive ML Playground • Binary Classification (Svelte 5)
      </p>
    </div>
    <div class="flex gap-4">
      <button 
        onclick={reset}
        class="p-3 border hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-2xl"
        title="Reset Network"
        id="btn-reset"
      >
        <RotateCcw class="w-5 h-5" />
      </button>
      <button 
        onclick={togglePlay}
        disabled={mode === 'manual'}
        class="px-8 py-3 border border-[#141414] flex items-center gap-2 transition-all rounded-2xl {
          mode === 'manual' 
            ? 'opacity-40 bg-[#E1DFDB] text-[#141414]/40 border-gray-400 cursor-not-allowed' 
            : isPlaying 
              ? 'bg-[#141414] text-[#E4E3E0]' 
              : 'hover:bg-[#141414] hover:text-[#E4E3E0]'
        }"
        title={mode === 'manual' ? 'Train button is offline in Manual Weight Tuning mode.' : 'Toggle training'}
        id="btn-train"
      >
        {#if isPlaying}
          <Pause class="w-5 h-5" />
        {:else}
          <Play class="w-5 h-5" />
        {/if}
        <span class=" uppercase tracking-wider">
          {mode === 'manual' ? 'Backprop Paused' : isPlaying ? 'Stop' : 'Train'}
        </span>
      </button>
    </div>
  </header>

  <main class="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-100px)] ">
    <!-- Left Panel: Controls -->
    <aside class="lg:col-span-3  p-6 overflow-y-auto  backdrop-blur-sm">
      <div class="space-y-6">
        
        <!-- Mode Selection -->
        <section class="p-4 border border-[#141414] bg-[#F27D26]/10 rounded-2xl" id="section-mode">
          <h2 class="text-xs  uppercase tracking-widest opacity-80 mb-3 flex items-center gap-1.5 font-bold">
            <Zap class="w-4 h-4 text-[#F27D26]" /> Training Mode
          </h2>
          <div class="grid grid-cols-2 gap-2 text-[10px]  uppercase">
            <button
              onclick={() => {
                mode = 'auto';
              }}
              class="p-2 border border-[#141414] transition-all flex flex-col items-center justify-center gap-0.5 rounded-2xl {
                mode === 'auto' ? 'bg-[#141414] text-[#E4E3E0] font-bold' : 'bg-white text-black hover:bg-[#141414]/10'
              }"
              id="btn-mode-auto"
            >
              <span>Auto mode</span>
              <span class="text-[7.5px] opacity-70 font-normal">Backpropagation</span>
            </button>
            <button
              onclick={() => {
                mode = 'manual';
                isPlaying = false;
              }}
              class="p-2 border border-[#141414] transition-all flex flex-col items-center justify-center gap-0.5 rounded-2xl {
                mode === 'manual' ? 'bg-[#141414] text-[#E4E3E0] font-bold' : 'bg-white text-black hover:bg-[#141414]/10'
              }"
              id="btn-mode-manual"
            >
              <span>Manual mode</span>
              <span class="text-[7.5px] opacity-70 font-normal">Tuning</span>
            </button>
          </div>
        </section>

        <section id="section-config">
          <h2 class="text-xs  uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 rounded-2xl ">
            <Settings2 class="w-4 h-4" /> Configuration
          </h2>
          
          <div class="space-y-6 ">
            <div>
              <label class="text-sm font-sans font-semibold block mb-2 " for="range-lr">
                Learning Rate: {learningRate.toFixed(3)} {mode === 'manual' ? '(Offline)' : ''}
              </label>
              <input 
                type="range" 
                id="range-lr"
                min="0.001" 
                max="0.5" 
                step="0.001" 
                bind:value={learningRate}
                disabled={mode === 'manual'}
                oninput={() => {
                  if (nnRef) nnRef.learningRate = learningRate;
                }}
                class="w-full accent-[#141414] {mode === 'manual' ? 'opacity-40 cursor-not-allowed' : ''}"
              />
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm font-sans font-semibold" id="label-hddl-layers">Hidden Layers</span>
                <div class="flex gap-2">
                  <button onclick={removeLayer} class="p-1  border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] rounded-2xl" aria-label="Decrease layers"><Minus class="w-4 h-4" /></button>
                  <button onclick={addLayer} class="p-1 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] rounded-2xl" aria-label="Increase layers"><Plus class="w-4 h-4" /></button>
                </div>
              </div>

              <div class="space-y-2 bg-[#f5f5f5]">
                {#each layers as layer, idx}
                  <div class="p-3 border border-[#141414] bg-white/50 transition-all rounded-2xl ">
                    <div class="flex justify-between items-center mb-2">
                      <span class="text-[10px]  uppercase opacity-50">Layer {idx + 1}</span>
                      <div class="flex items-center gap-2">
                        <button 
                          onclick={() => updateLayer(idx, { neurons: Math.max(1, layer.neurons - 1) })}
                          class="w-5 h-5 border border-[#141414] flex items-center justify-center text-xs rounded-2xl "
                          aria-label="Decrease neurons"
                        >-</button>
                        <span class=" text-sm w-4 text-center">{layer.neurons}</span>
                        <button 
                          onclick={() => updateLayer(idx, { neurons: Math.min(8, layer.neurons + 1) })}
                          class="w-5 h-5 border border-[#141414] flex items-center justify-center text-xs rounded-2xl"
                          aria-label="Increase neurons"
                        >+</button>
                      </div>
                    </div>
                    <select 
                      bind:value={layer.activation}
                      onchange={(e) => updateLayer(idx, { activation: (e.target as HTMLSelectElement).value as ActivationType })}
                      class="w-full bg-transparent border border-[#141414] p-1.5 text-xs  uppercase"
                      aria-label="Layer activation class"
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

        <!-- Manual Adjustment Control Card -->
        {#if mode === 'manual'}
          <TuningConsole
            {selectedElement}
            {networkState}
            onadjustWeight={adjustWeight}
            onadjustBias={adjustBias}
            onsetElementValue={setElementValue}
            onmanualTuneEnd={() => {
              const currentMSE = calculateCurrentMSE(nnRef, dataPoints);
              recordManualLossEntry(currentMSE);
            }}
          />
        {/if}

        <section id="section-stats">
          <h2 class="text-xs  bg-[#f5f5f5] uppercase tracking-widest opacity-50 mb-4 flex items-center gap-2 ">
            <Activity class="w-4 h-4" /> Stats
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 border border-[#141414] bg-white rounded-2xl bg-[#f5f5f5] ">
              <div class="text-[10px]  uppercase opacity-50 bg-[#f5f5f5]">Epochs</div>
              <div class="text-2xl font-sans font-bold">{epoch}</div>
            </div>
            <div class="p-4 border border-[#141414] bg-white rounded-2xl bg-[#f5f5f5]">
              <div class="text-[10px]  uppercase opacity-50">Loss (MSE)</div>
              <div class="text-2xl font-sans font-bold">
                {currentLoss.toFixed(4)}
              </div>
            </div>
          </div>
        </section>

        <!-- Loss Curve Component -->
        <LossCurve {lossHistory} />
      </div>
    </aside>

    <!-- Center Panel: Visualization -->
    <div class="lg:col-span-6  border-[#141414] p-6 flex flex-col gap-6 overflow-hidden rounded-2xl">
      <!-- Network Diagram Component -->
      <NetworkDiagram
        {networkState}
        {mode}
        {selectedElement}
        onselectElement={(elem) => {
          selectedElement = elem;
        }}
      />

      <div class="h-1/3 border border-[#141414] bg-[#141414] text-[#E4E3E0] p-6  text-xs overflow-y-auto rounded-2xl">
        <div class="flex items-center gap-2 mb-2 opacity-50">
          <Info class="w-4 h-4" /> <span>System Logs</span>
        </div>
        <p class="mb-1 text-[#F27D26]">{">> "}Initializing neural network with {layers.length} hidden layers...</p>
        <p class="mb-1">{">> "}Dataset: Binary classification (Circular boundary)</p>
        <p class="mb-1">{">> "}Activation: {layers.map(l => l.activation).join(', ')}</p>
        <p class="mb-1">{">> "}Learning rate set to {learningRate}</p>
        {#if isPlaying}
          <p class="animate-pulse text-[#F27D26]">{">> "}Training in progress... Epoch: {epoch}</p>
        {/if}
      </div>
    </div>

    <!-- Decision Space Component -->
    <DecisionSpace
      {networkState}
      {nnRef}
      {dataPoints}
      ongenerateData={generateData}
    />
  </main>

</div>
