<script lang="ts">
  import type { Act, ONeuron, Layer2Neuron } from '$lib/types';
  import ThreeDPlot from "$lib/components/overview/ThreeDPlot.svelte";
  import NetworkDiagram from "$lib/components/overview/NetworkDiagram.svelte";
  import { evaluateNetwork } from "$lib/math/overview-math";
  import {
    Brain,
    Sliders,
    RotateCcw,
    BookOpen,
    Binary,
    CheckCircle,
    XCircle,
    Gauge
  } from "lucide-svelte";

  // --- Network Architecture & State ---
  let layerCount = $state<number>(1);
  let neuronCount = $state<number>(1);
  let activeNeuronIdx = $state<number>(0);
  let neurons = $state<ONeuron[]>([
    { w1: 1.5, w2: 1.5, act: "tanh" },
  ]);
  let bias = $state<number>(0.0);
  let outputActivation = $state<Act>("tanh");

  // --- Layer 2 State ---
  let layer2NeuronCount = $state<number>(2);
  let layer2Neurons = $state<Layer2Neuron[]>([
    { v1: 1.0, v2: -1.0, v3: 0.5, act: "tanh" },
    { v1: -0.8, v2: 1.2, v3: -1.0, act: "tanh" },
  ]);
  let bias2 = $state<number>(0.0);
  let activeLayerIdx = $state<number>(0);
  let activeLayer2Idx = $state<number>(0);

  // --- Live Testing Coordinates Playground ---
  let testX1 = $state<number>(1.0);
  let testX2 = $state<number>(1.0);

  // Event-driven Setter for Layer 1 Neurons Count
  const setNeuronCount = (count: number) => {
    neuronCount = count;
    
    // Adjust active neuron index if needed
    if (activeNeuronIdx >= count) {
      activeNeuronIdx = 0;
    }

    // Synchronize size of neurons list
    let next = [...neurons];
    if (next.length < count) {
      const needed = count - next.length;
      for (let i = 0; i < needed; i++) {
        const seedW = [
          { w1: -1.5, w2: 2.0 },
          { w1: 2.0, w2: -1.5 },
          { w1: 1.0, w2: 1.0 },
        ];
        const sw = seedW[next.length] || { w1: 1.0, w2: -1.0 };
        next.push({
          w1: parseFloat(sw.w1.toFixed(1)),
          w2: parseFloat(sw.w2.toFixed(1)),
          act: neurons[0]?.act || "tanh",
        });
      }
    } else if (next.length > count) {
      next = next.slice(0, count);
    }
    neurons = next;
  };

  // Event-driven Setter for Layer 2 Neurons Count
  const setLayer2NeuronCount = (count: number) => {
    layer2NeuronCount = count;

    // Adjust active selected index for Layer 2 if needed
    if (activeLayer2Idx >= count) {
      activeLayer2Idx = 0;
    }

    // Synchronize size of layer 2 neurons list
    let next = [...layer2Neurons];
    if (next.length < count) {
      const needed = count - next.length;
      for (let i = 0; i < needed; i++) {
        const seedV = [
          { v1: 1.0, v2: -1.0, v3: 0.5 },
          { v1: -0.8, v2: 1.2, v3: -1.0 },
          { v1: 1.5, v2: 1.5, v3: -0.5 },
        ];
        const sv = seedV[next.length] || { v1: 1.0, v2: 1.0, v3: 1.0 };
        next.push({
          v1: parseFloat(sv.v1.toFixed(1)),
          v2: parseFloat(sv.v2.toFixed(1)),
          v3: parseFloat(sv.v3.toFixed(1)),
          act: layer2Neurons[0]?.act || "tanh",
        });
      }
    } else if (next.length > count) {
      next = next.slice(0, count);
    }
    layer2Neurons = next;
  };

  // Randomized neural initial state weights generator
  const randomizeNeuronsWeights = () => {
    const next = neurons.map((n) => ({
      w1: parseFloat((Math.random() * 6 - 3).toFixed(1)),
      w2: parseFloat((Math.random() * 6 - 3).toFixed(1)),
      act: n.act,
    }));
    neurons = next;
    bias = parseFloat((Math.random() * 4 - 2).toFixed(1));

    if (layerCount === 2) {
      const next2 = layer2Neurons.map((n) => ({
        v1: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        v2: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        v3: parseFloat((Math.random() * 6 - 3).toFixed(1)),
        act: n.act,
      }));
      layer2Neurons = next2;
      bias2 = parseFloat((Math.random() * 4 - 2).toFixed(1));
    }
  };

  // Helper single neuron parameters editor
  const handleWeightChange = (key: "w1" | "w2", val: number) => {
    const next = neurons.map((neu, idx) => {
      if (idx === activeNeuronIdx) {
        return { ...neu, [key]: parseFloat(val.toFixed(1)) };
      }
      return neu;
    });
    neurons = next;
  };

  const handleNeuronActivationChange = (val: Act) => {
    const next = neurons.map((neu, idx) => {
      if (idx === activeNeuronIdx) {
        return { ...neu, act: val };
      }
      return neu;
    });
    neurons = next;
  };

  const handleLayer2WeightChange = (key: "v1" | "v2" | "v3", val: number) => {
    const next = layer2Neurons.map((neu, idx) => {
      if (idx === activeLayer2Idx) {
        return { ...neu, [key]: parseFloat(val.toFixed(1)) };
      }
      return neu;
    });
    layer2Neurons = next;
  };

  const handleLayer2ActivationChange = (val: Act) => {
    const next = layer2Neurons.map((neu, idx) => {
      if (idx === activeLayer2Idx) {
        return { ...neu, act: val };
      }
      return neu;
    });
    layer2Neurons = next;
  };

  // Calculate live evaluation prediction
  let outputVal = $derived(evaluateNetwork(
    testX1,
    testX2,
    neurons,
    bias,
    layerCount === 2 || neuronCount > 1 ? outputActivation : neurons[0]?.act || "tanh",
    layerCount,
    layerCount === 2 ? layer2Neurons : [],
    bias2
  ));
</script>

<div class="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none antialiased p-4 md:p-6 overflow-x-hidden">
  
  <!-- HEADER BAR -->
  <!-- <header class="px-6 py-5 bg-white border-2 border-[#141414] shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
    <div class="flex items-center gap-4">
      <div class="bg-[#F27D26] border-2 border-[#141414] p-3 shadow-[2px_2px_0px_#141414]">
        <Brain class="w-7 h-7 text-[#141414]" />
      </div>
      <div>
        <h1 class="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#141414] flex items-baseline gap-2 capitalize">
          perceptron 3d lab
          <span class="font-serif italic text-base font-normal text-[#141414]/70">
            mapping space
          </span>
        </h1>
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#141414]/70 mt-1">
          visualize multidimensional decision boundaries, multi-neuron combinations, and high-fidelity output space.
        </p>
      </div>
    </div> -->

    <!-- Live configuration metrics badge -->
    <!-- <div class="flex flex-wrap items-center gap-3 bg-[#E4E3E0] border-2 border-[#141414] px-4 py-2 rounded-none font-mono text-xs shadow-[2px_2px_0px_#141414] font-bold">
      <span class="text-[#141414]/60 uppercase">Layers:</span>
      <span class="text-[#F27D26]">{layerCount}</span>
      <span class="text-[#141414]/20 font-light">/</span>
      <span class="text-[#141414]/60 uppercase">Nodes:</span>
      <span class="text-[#141414]">
        {layerCount === 2 ? `${neuronCount} → ${layer2NeuronCount}` : `${neuronCount}`}
      </span>
      <span class="text-[#141414]/20 font-light">/</span>
      <span class="text-[#141414]/60 uppercase">Biases:</span>
      <span class="text-[#141414]">
        {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)}
        {#if layerCount === 2}
          | {bias2 >= 0 ? `+${bias2.toFixed(1)}` : bias2.toFixed(1)}
        {/if}
      </span>
    </div>
  </header> -->

  <!-- MAIN CONTENT GRID -->
  <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
    
    <!-- LEFT PANEL: Controls, Sliders, and Presets (5 cols) -->
    <div class="lg:col-span-5 flex flex-col gap-6">
      
      <!-- NEURAL CONFIGURATION CARD -->
      <section class="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col gap-5">
        <h3 class="text-xs font-mono font-black uppercase text-[#141414] tracking-widest flex items-center gap-2 border-b-2 border-[#141414] pb-2">
          <Sliders class="w-4 h-4 text-[#F27D26]" />
          Architecture Config
        </h3>

        <!-- Option for Layers Count -->
        <div class="space-y-2">
          <label class="text-[10px] text-[#141414]/70 font-black font-mono uppercase tracking-widest block">
            Network Layer Depth
          </label>
          <div class="grid grid-cols-2 gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
            {#each [1, 2] as num}
              <button
                onclick={() => {
                  layerCount = num;
                  activeLayerIdx = 0;
                }}
                class="py-2 text-xs font-bold font-mono transition cursor-pointer {
                  layerCount === num
                    ? 'bg-[#141414] text-[#E4E3E0]'
                    : 'text-[#141414]/60 hover:text-[#141414] hover:bg-white/40'
                }"
              >
                {num} {num === 1 ? 'Hidden Layer' : 'Hidden Layers'}
              </button>
            {/each}
          </div>
        </div>

        <!-- Neuron Count Swapper -->
        <div class="space-y-2">
          <label class="text-[10px] text-[#141414]/70 font-black font-mono uppercase tracking-widest block">
            {layerCount === 2 ? "Layer 1 (L1) Hidden Neurons" : "Number of Hidden Neurons"}
          </label>
          <div class="grid grid-cols-3 gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
            {#each [1, 2, 3] as num}
              <button
                onclick={() => setNeuronCount(num)}
                class="py-2 text-xs font-bold font-mono transition cursor-pointer {
                  neuronCount === num
                    ? 'bg-[#141414] text-[#E4E3E0]'
                    : 'text-[#141414]/60 hover:text-[#141414] hover:bg-white/40'
                }"
              >
                {num} {num === 1 ? 'Node' : 'Nodes'}
              </button>
            {/each}
          </div>
        </div>

        <!-- Layer 2 Neuron Count Swapper -->
        {#if layerCount === 2}
          <div class="space-y-2">
            <label class="text-[10px] text-[#141414]/70 font-black font-mono uppercase tracking-widest block">
              Layer 2 (L2) Hidden Neurons
            </label>
            <div class="grid grid-cols-3 gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
              {#each [1, 2, 3] as num}
                <button
                  onclick={() => setLayer2NeuronCount(num)}
                  class="py-2 text-xs font-bold font-mono transition cursor-pointer {
                    layer2NeuronCount === num
                      ? 'bg-[#141414] text-[#E4E3E0]'
                      : 'text-[#141414]/60 hover:text-[#141414] hover:bg-white/40'
                  }"
                >
                  {num} {num === 1 ? 'Node' : 'Nodes'}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Global/Separated Bias Sliders -->
        <div class="bg-[#E4E3E0] border border-[#141414] p-4 flex flex-col gap-4 shadow-[2px_2px_0px_#141414]">
          
          <!-- Bias 1 -->
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-[#141414] flex items-center gap-1 font-mono uppercase tracking-wider">
                {layerCount === 2 ? "Layer 1 Bias" : "Global Bias"} <span class="text-[#F27D26]">b₁</span>
              </span>
              <span class="font-extrabold text-[#F27D26] font-mono text-sm">
                {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              bind:value={bias}
              class="w-full h-2 bg-white border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
            />
          </div>

          <!-- Bias 2 (only in 2-layer mode) -->
          {#if layerCount === 2}
            <div class="flex flex-col gap-1.5 border-t border-[#141414]/15 pt-3">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-[#141414] flex items-center gap-1 font-mono uppercase tracking-wider">
                  Layer 2 Bias <span class="text-[#F27D26]">b₂</span>
                </span>
                <span class="font-extrabold text-[#F27D26] font-mono text-sm">
                  {bias2 >= 0 ? `+${bias2.toFixed(1)}` : bias2.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.1"
                bind:value={bias2}
                class="w-full h-2 bg-white border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
              />
            </div>
          {/if}

          <span class="text-[9.5px] text-[#141414]/70 font-mono uppercase tracking-tight leading-relaxed">
            * Bias offsets the activation boundary of all units inside respective layers.
          </span>
        </div>

        <!-- SLIDERS FOR DETAILED NEURON TWEAKS -->
        <div class="border border-[#141414] bg-[#E4E3E0]/30 p-4 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-[10px] uppercase font-mono text-[#141414] tracking-widest font-black">
              Synaptic Weights
            </span>
            <button
              onclick={randomizeNeuronsWeights}
              class="text-[#141414] hover:bg-[#F27D26] flex items-center gap-1.5 text-[9px] bg-white px-2 py-1.5 font-mono uppercase tracking-wider border border-[#141414] transition cursor-pointer shadow-[1px_1px_0px_#141414] active:shadow-none"
            >
              <RotateCcw class="w-3 h-3" /> Randomize
            </button>
          </div>

          <!-- Parameter selector tabs -->
          {#if layerCount === 2}
            <div class="grid grid-cols-2 gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
              <button
                onclick={() => activeLayerIdx = 0}
                class="py-1.5 text-[10px] font-bold font-mono uppercase cursor-pointer transition {
                  activeLayerIdx === 0
                    ? 'bg-[#141414] text-[#E4E3E0]'
                    : 'text-[#141414]/60 hover:text-[#141414] hover:bg-white/40'
                }"
              >
                Layer 1 (L1)
              </button>
              <button
                onclick={() => activeLayerIdx = 1}
                class="py-1.5 text-[10px] font-bold font-mono uppercase cursor-pointer transition {
                  activeLayerIdx === 1
                    ? 'bg-[#141414] text-[#E4E3E0]'
                    : 'text-[#141414]/60 hover:text-[#141414] hover:bg-white/40'
                }"
              >
                Layer 2 (L2)
              </button>
            </div>
          {/if}

          <!-- Node Swapper Tab Selection for Layer 1 -->
          {#if (layerCount === 1 || activeLayerIdx === 0) && neuronCount > 1}
            <div class="flex gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
              {#each neurons.slice(0, neuronCount) as _, idx}
                <button
                  onclick={() => activeNeuronIdx = idx}
                  class="flex-1 py-1.5 text-[9px] font-mono font-black uppercase transition cursor-pointer {
                    activeNeuronIdx === idx
                      ? 'bg-[#141414] text-[#E4E3E0]'
                      : 'text-[#141414]/50 hover:text-[#141414] hover:bg-white/40'
                  }"
                >
                  Neuron {idx + 1}
                </button>
              {/each}
            </div>
          {/if}

          <!-- Node Swapper Tab Selection for Layer 2 -->
          {#if layerCount === 2 && activeLayerIdx === 1 && layer2NeuronCount > 1}
            <div class="flex gap-1 bg-[#E4E3E0] p-1 border border-[#141414]">
              {#each layer2Neurons.slice(0, layer2NeuronCount) as _, idx}
                <button
                  onclick={() => activeLayer2Idx = idx}
                  class="flex-1 py-1.5 text-[9px] font-mono font-black uppercase transition cursor-pointer {
                    activeLayer2Idx === idx
                      ? 'bg-[#141414] text-[#E4E3E0]'
                      : 'text-[#141414]/50 hover:text-[#141414] hover:bg-white/40'
                  }"
                >
                  Neuron {idx + 1}
                </button>
              {/each}
            </div>
          {/if}

          <!-- Sliders for active Layer 1 weight card -->
          {#if (layerCount === 1 || activeLayerIdx === 0) && neurons[activeNeuronIdx]}
            <div class="space-y-4">
              
              <!-- Weight 1 (w1) -->
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold">
                  <span class="text-[#141414]/70">Weight 1 (w₁)</span>
                  <span class="text-[#141414] font-black bg-white px-1.5 py-0.5 border border-[#141414]">
                    {neurons[activeNeuronIdx].w1 >= 0
                      ? `+${neurons[activeNeuronIdx].w1.toFixed(1)}`
                      : neurons[activeNeuronIdx].w1.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.1"
                  value={neurons[activeNeuronIdx].w1}
                  oninput={(e) => handleWeightChange("w1", parseFloat((e.target as HTMLInputElement).value))}
                  class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#141414] outline-none"
                />
              </div>

              <!-- Weight 2 (w2) -->
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold">
                  <span class="text-[#141414]/70">Weight 2 (w₂)</span>
                  <span class="text-[#141414] font-black bg-white px-1.5 py-0.5 border border-[#141414]">
                    {neurons[activeNeuronIdx].w2 >= 0
                      ? `+${neurons[activeNeuronIdx].w2.toFixed(1)}`
                      : neurons[activeNeuronIdx].w2.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.1"
                  value={neurons[activeNeuronIdx].w2}
                  oninput={(e) => handleWeightChange("w2", parseFloat((e.target as HTMLInputElement).value))}
                  class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
                />
              </div>

              <!-- Activation Selector -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] text-[#141414]/70 font-mono uppercase tracking-widest font-black">
                  Activation function (f_L1)
                </label>
                <select
                  value={neurons[activeNeuronIdx].act}
                  onchange={(e) => handleNeuronActivationChange((e.target as HTMLSelectElement).value as Act)}
                  class="w-full bg-white hover:bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs text-[#141414] focus:outline-none transition font-mono tracking-wide cursor-pointer shadow-[2px_2px_0px_#141414]"
                >
                  <option value="sign">sign (hard threshold signum [-1, 1])</option>
                  <option value="step">step (binary threshold Heaviside [0, 1])</option>
                  <option value="tanh">tangent (hyperbolic tanh continuous [-1, 1])</option>
                  <option value="sigmoid">sigmoid (logistic continuous [0, 1])</option>
                  <option value="relu">ReLU (rectified linear positive pass [0, inf))</option>
                </select>
              </div>
            </div>
          {/if}

          <!-- Sliders for active Layer 2 weight card -->
          {#if layerCount === 2 && activeLayerIdx === 1 && layer2Neurons[activeLayer2Idx]}
            <div class="space-y-4">
              
              <!-- weight v1 -->
              <div class="flex flex-col gap-1.5">
                <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold">
                  <span class="text-[#141414]/70">L2 Conn 1 Weight (v₁)</span>
                  <span class="text-[#141414] font-black bg-white px-1.5 py-0.5 border border-[#141414]">
                    {layer2Neurons[activeLayer2Idx].v1 >= 0
                      ? `+${layer2Neurons[activeLayer2Idx].v1.toFixed(1)}`
                      : layer2Neurons[activeLayer2Idx].v1.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.1"
                  value={layer2Neurons[activeLayer2Idx].v1}
                  oninput={(e) => handleLayer2WeightChange("v1", parseFloat((e.target as HTMLInputElement).value))}
                  class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#141414] outline-none"
                />
              </div>

              <!-- weight v2 - only if Layer 1 has 2 or 3 neurons -->
              {#if neuronCount >= 2}
                <div class="flex flex-col gap-1.5">
                  <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold">
                    <span class="text-[#141414]/70">L2 Conn 2 Weight (v₂)</span>
                    <span class="text-[#141414] font-black bg-white px-1.5 py-0.5 border border-[#141414]">
                      {layer2Neurons[activeLayer2Idx].v2 >= 0
                        ? `+${layer2Neurons[activeLayer2Idx].v2.toFixed(1)}`
                        : layer2Neurons[activeLayer2Idx].v2.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.1"
                    value={layer2Neurons[activeLayer2Idx].v2}
                    oninput={(e) => handleLayer2WeightChange("v2", parseFloat((e.target as HTMLInputElement).value))}
                    class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
                  />
                </div>
              {/if}

              <!-- weight v3 - only if Layer 1 has 3 neurons -->
              {#if neuronCount >= 3}
                <div class="flex flex-col gap-1.5">
                  <div class="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold">
                    <span class="text-[#141414]/70">L2 Conn 3 Weight (v₃)</span>
                    <span class="text-[#141414] font-black bg-white px-1.5 py-0.5 border border-[#141414]">
                      {layer2Neurons[activeLayer2Idx].v3 >= 0
                        ? `+${layer2Neurons[activeLayer2Idx].v3.toFixed(1)}`
                        : layer2Neurons[activeLayer2Idx].v3.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="0.1"
                    value={layer2Neurons[activeLayer2Idx].v3}
                    oninput={(e) => handleLayer2WeightChange("v3", parseFloat((e.target as HTMLInputElement).value))}
                    class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#141414] outline-none"
                  />
                </div>
              {/if}

              <!-- Activation Selector for Layer 2 -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] text-[#141414]/70 font-mono uppercase tracking-widest font-black">
                  Activation function (f_L2)
                </label>
                <select
                  value={layer2Neurons[activeLayer2Idx].act}
                  onchange={(e) => handleLayer2ActivationChange((e.target as HTMLSelectElement).value as Act)}
                  class="w-full bg-white hover:bg-[#E4E3E0] border border-[#141414] px-3 py-2 text-xs text-[#141414] focus:outline-none transition font-mono tracking-wide cursor-pointer shadow-[2px_2px_0px_#141414]"
                >
                  <option value="sign">sign (hard threshold signum [-1, 1])</option>
                  <option value="step">step (binary threshold Heaviside [0, 1])</option>
                  <option value="tanh">tangent (hyperbolic tanh continuous [-1, 1])</option>
                  <option value="sigmoid">sigmoid (logistic continuous [0, 1])</option>
                  <option value="relu">ReLU (rectified linear positive pass [0, inf))</option>
                </select>
              </div>
            </div>
          {/if}
        </div>

        <!-- Combined Output layer activation if count > 1 or depth === 2 -->
        {#if layerCount === 2 || neuronCount > 1}
          <div class="bg-[#E4E3E0] border border-[#141414] p-4 flex flex-col gap-3 shadow-[2px_2px_0px_#141414]">
            <label class="text-[10px] text-[#141414] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
              Combiner Activation (g)
            </label>
            <select
              bind:value={outputActivation}
              class="w-full bg-white border border-[#141414] px-3 py-2 text-xs text-[#141414] font-mono focus:outline-none transition cursor-pointer"
            >
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">relu</option>
            </select>
          </div>
        {/if}
      </section>

      <!-- REALTIME TESTING SUITE -->
      <section class="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col gap-4">
        <h3 class="text-xs font-mono font-black uppercase text-[#141414] tracking-widest flex items-center gap-2 border-b-2 border-[#141414] pb-2">
          <Binary class="w-4 h-4 text-[#F27D26]" />
          Coordinate Evaluation
        </h3>

        <div class="grid grid-cols-2 gap-4">
          <!-- x1 Input slider & field -->
          <div class="flex flex-col gap-2 bg-[#E4E3E0] p-3 border border-[#141414] shadow-[2px_2px_0px_#141414]">
            <span class="text-[10px] text-[#141414]/90 font-mono uppercase tracking-wider font-extrabold">Input Coord x₁</span>
            <input
              type="number"
              step="0.5"
              min="-5"
              max="5"
              bind:value={testX1}
              class="bg-white text-[#141414] font-mono text-xs border border-[#141414] px-2 py-1 focus:outline-none"
            />
            <input
              type="range"
              min="-5"
              max="5"
              step="0.2"
              bind:value={testX1}
              class="w-full h-2 bg-white border border-[#141414] appearance-none cursor-ew-resize accent-[#141414] outline-none"
            />
          </div>

          <!-- x2 Input slider & field -->
          <div class="flex flex-col gap-2 bg-[#E4E3E0] p-3 border border-[#141414] shadow-[2px_2px_0px_#141414]">
            <span class="text-[10px] text-[#141414]/90 font-mono uppercase tracking-wider font-extrabold">Input Coord x₂</span>
            <input
              type="number"
              step="0.5"
              min="-5"
              max="5"
              bind:value={testX2}
              class="bg-white text-[#141414] font-mono text-xs border border-[#141414] px-2 py-1 focus:outline-none"
            />
            <input
              type="range"
              min="-5"
              max="5"
              step="0.2"
              bind:value={testX2}
              class="w-full h-2 bg-white border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
            />
          </div>
        </div>

        <!-- Live output prediction screen -->
        <div class="bg-[#E4E3E0] border border-[#141414] px-4 py-3.5 flex items-center justify-between shadow-inner">
          <div class="flex items-center gap-2">
            <Gauge class="w-5 h-5 text-[#F27D26]" />
            <div>
              <span class="text-[10px] uppercase font-mono text-[#141414] block tracking-wider font-black">
                Evaluated Output
              </span>
              <span class="text-[9.5px] italic text-[#141414]/70 font-serif">
                at x₁={testX1.toFixed(1)}, x₂={testX2.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold font-mono tracking-tight text-[#141414]">
              y = {outputVal >= 0 ? `+${outputVal.toFixed(4)}` : outputVal.toFixed(4)}
            </span>
            
            {#if outputVal >= 0.5}
              <CheckCircle class="w-5 h-5 text-[#F27D26] fill-white stroke-[#141414]" />
            {:else}
              <XCircle class="w-5 h-5 text-[#141414]/40 fill-white stroke-[#141414]" />
            {/if}
          </div>
        </div>
      </section>

      <!-- MAPPING EQUATIONS -->
      <section class="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col gap-4">
        <h3 class="text-xs font-mono font-black uppercase text-[#141414] tracking-widest flex items-center gap-2 border-b-2 border-[#141414] pb-2">
          <BookOpen class="w-4 h-4 text-[#F27D26]" />
          Mapping Equations
        </h3>
        <div class="bg-[#E4E3E0] p-4 border border-[#141414] font-mono space-y-1 text-[11px] text-[#141414] shadow-[2px_2px_0px_#141414] overflow-x-auto">
          {#if layerCount === 2}
            <p class="text-[#141414] font-black">
              y = {outputActivation}( ∑ h₂_j )
            </p>
            <p class="text-[10px] font-bold mt-2 text-[#141414]/70 uppercase tracking-widest border-b border-[#141414]/10 pb-0.5">
              Layer 2 Hidden Nodes:
            </p>
            <div class="text-[9.5px] text-[#141414] pl-2 space-y-1 mt-1 uppercase font-medium leading-normal">
              {#each layer2Neurons.slice(0, layer2NeuronCount) as neu, idx}
                {@const v1Part = `${neu.v1 >= 0 ? `+${neu.v1.toFixed(1)}` : neu.v1.toFixed(1)}·h₁_1`}
                {@const v2Part = neuronCount >= 2 ? ` ${neu.v2 >= 0 ? `+${neu.v2.toFixed(1)}` : neu.v2.toFixed(1)}·h₁_2` : ""}
                {@const v3Part = neuronCount >= 3 ? ` ${neu.v3 >= 0 ? `+${neu.v3.toFixed(1)}` : neu.v3.toFixed(1)}·h₁_3` : ""}
                {@const bPart = bias2 >= 0 ? `+${bias2.toFixed(1)}` : bias2.toFixed(1)}
                <p>
                  h₂__{idx+1} = {neu.act}( {v1Part}{v2Part}{v3Part} {bPart} )
                </p>
              {/each}
            </div>
            <p class="text-[10px] font-bold mt-2.5 text-[#141414]/70 uppercase tracking-widest border-b border-[#141414]/10 pb-0.5">
              Layer 1 Hidden Nodes:
            </p>
            <div class="text-[9.5px] text-[#141414] pl-2 space-y-0.5 mt-1 uppercase font-medium leading-normal">
              {#each neurons.slice(0, neuronCount) as neu, idx}
                <p>
                  h₁__{idx+1} = {neu.act}( {neu.w1 >= 0 ? `+${neu.w1.toFixed(1)}` : neu.w1.toFixed(1)}·x₁ + {neu.w2 >= 0 ? `+${neu.w2.toFixed(1)}` : neu.w2.toFixed(1)}·x₂ + {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)} )
                </p>
              {/each}
            </div>
          {:else if neuronCount === 1}
            <p class="text-[#141414] font-black">
              y = {neurons[0]?.act}( <span class="text-[#141414]">{neurons[0]?.w1 >= 0 ? `+${neurons[0].w1}` : neurons[0].w1}</span> · x₁ + <span class="text-[#F27D26]">{neurons[0]?.w2 >= 0 ? `+${neurons[0].w2}` : neurons[0].w2}</span> · x₂ <span class="text-[#F27D26]">{bias >= 0 ? `+${bias}` : bias}</span> )
            </p>
            <p class="text-[10px] text-[#141414]/65 mt-2 uppercase tracking-wide">
              * Single linear separation boundary separating coordinates.
            </p>
          {:else}
            <p class="text-[#141414] font-black">
              y = {outputActivation}( ∑ h_i )
            </p>
            <div class="text-[10px] text-[#141414] pl-2 space-y-1.5 mt-1.5 uppercase font-bold">
              {#each neurons.slice(0, neuronCount) as neu, idx}
                <p>
                  h__{idx+1} = {neu.act}( {neu.w1 >= 0 ? `+${neu.w1}` : neu.w1}·x₁ + {neu.w2 >= 0 ? `+${neu.w2}` : neu.w2}·x₂ + {bias >= 0 ? `+${bias}` : bias} )
                </p>
              {/each}
            </div>
          {/if}
        </div>
      </section>
    </div>

    <!-- RIGHT PANEL: 3D Render Graphics and SVG Diagrams (7 cols) -->
    <div class="lg:col-span-7 flex flex-col gap-6">
      
      <!-- THREE DIMENSIONAL GRAPH PLOT -->
      <div class="flex-1 min-h-[380px] flex flex-col bg-white border-2 border-[#141414] p-5 relative shadow-[4px_4px_0px_#141414]">
        <ThreeDPlot
          {neurons}
          {bias}
          outputActivation={layerCount === 2 || neuronCount > 1 ? outputActivation : neurons[0]?.act || "tanh"}
          {layerCount}
          layer2Neurons={layerCount === 2 ? layer2Neurons : []}
          {bias2}
        />
      </div>

      <!-- SCHEMATIC CIRCUIT GRAPH DIAGRAM -->
      <div class="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414]">
        <NetworkDiagram
          {neurons}
          {bias}
          outputActivation={layerCount === 2 || neuronCount > 1 ? outputActivation : neurons[0]?.act || "tanh"}
          {layerCount}
          layer2Neurons={layerCount === 2 ? layer2Neurons : []}
          {bias2}
        />
      </div>
    </div>

  </main>
</div>
