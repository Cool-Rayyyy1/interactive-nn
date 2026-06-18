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

<div class="min-h-screen text-[#141414] flex flex-col select-none antialiased p-4 md:p-6 overflow-x-hidden">

  <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

    <!-- LEFT PANEL -->
    <div class="lg:col-span-5 flex flex-col gap-6">

      <!-- CONFIG CARD -->
      <section class="bg-white border rounded-2xl p-5 flex flex-col gap-5 shadow-sm">

        <h3 class="text-xs font-black tracking-widest flex items-center gap-2 border-b border-black/30 pb-3">
          <Sliders class="w-4 h-4 text-[#F27D26]" />
          Configurations
        </h3>

        <!-- Layer Count -->
        <div class="space-y-2">
          <label class="text-[10px] text-[#141414]/70 font-black tracking-widest block">
            Network Layer Depth
          </label>

          <div class="grid grid-cols-2 gap-1 bg-[#f5f5f5] p-1 border border-black/30 rounded-2xl">

            {#each [1, 2] as num}
              <button
                onclick={() => {
                  layerCount = num;
                  activeLayerIdx = 0;
                }}
                class="
                  py-2
                  text-xs
                  font-bold
                  transition
                  duration-200
                  cursor-pointer
                  rounded-2xl
                  active:scale-[0.98]

                  {
                    layerCount === num
                      ? 'bg-[#141414] text-white'
                      : 'text-[#141414]/60 hover:bg-white hover:text-[#141414] hover:scale-[1.02]'
                  }
                "
              >
                {num} {num === 1 ? 'Hidden Layer' : 'Hidden Layers'}
              </button>
            {/each}

          </div>
        </div>

        <!-- Neuron Count -->
        <div class="space-y-2">

          <label class="text-[10px] text-[#141414]/70 font-black tracking-widest block">
            {layerCount === 2 ? "Layer 1 (L1) Hidden Neurons" : "Number of Hidden Neurons"}
          </label>

          <div class="grid grid-cols-3 gap-1 bg-[#f5f5f5] p-1 border border-black/30 rounded-2xl">

            {#each [1, 2, 3] as num}
              <button
                onclick={() => setNeuronCount(num)}
                class="
                  py-2
                  text-xs
                  font-bold
                  transition
                  duration-200
                  cursor-pointer
                  rounded-2xl
                  active:scale-[0.98]

                  {
                    neuronCount === num
                      ? 'bg-[#141414] text-white'
                      : 'text-[#141414]/60 hover:bg-white hover:text-[#141414] hover:scale-[1.02]'
                  }
                "
              >
                {num} {num === 1 ? 'Node' : 'Nodes'}
              </button>
            {/each}

          </div>
        </div>

        <!-- Bias Box -->
        <div class="bg-[#f5f5f5] border border-black/30 rounded-3xl p-5 flex flex-col gap-4">

          <div class="flex flex-col gap-2">

            <div class="flex justify-between items-center text-xs">
              <span class="font-bold">
                Bias
              </span>

              <span class="font-bold text-[#F27D26]">
                {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min="-6"
              max="6"
              step="0.1"
              bind:value={bias}
              class="
                w-full
                h-2
                rounded-full
                bg-white
                border
                border-black/30
                appearance-none
                cursor-ew-resize
                accent-[#F27D26]
                outline-none
              "
            />
          </div>

          <span class="text-[10px] text-[#141414]/60 leading-relaxed">
            Bias offsets the activation boundary of all neurons.
          </span>

        </div>

        <!-- Synaptic Weights -->
        <div class="border border-black/30 bg-[#f5f5f5] rounded-3xl p-5 space-y-4">

          <div class="flex justify-between items-center">

            <span class="text-[10px] tracking-widest font-black">
              Weights
            </span>

            <button
              onclick={randomizeNeuronsWeights}
              class="
                bg-white
                border
                border-black/30
                rounded-2xl
                px-3
                py-2
                text-[10px]
                flex
                items-center
                gap-2
                transition
                duration-200
                cursor-pointer
                hover:bg-[#F27D26]
                hover:text-white
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              <RotateCcw class="w-3 h-3" />
              Randomize
            </button>

          </div>

          <!-- Weight Slider -->
          <div class="space-y-4">

            <div class="flex flex-col gap-2">

              <div class="flex justify-between items-center text-[11px] font-bold">

                <span class="text-[#141414]/70">
                  Weight 1 (w₁)
                </span>

                <span class="bg-white border border-black/30 rounded-xl px-2 py-1">
                  {neurons[activeNeuronIdx].w1.toFixed(1)}
                </span>

              </div>

              <input
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={neurons[activeNeuronIdx].w1}
                oninput={(e) =>
                  handleWeightChange(
                    "w1",
                    parseFloat((e.target as HTMLInputElement).value)
                  )
                }
                class="
                  w-full
                  h-2
                  rounded-full
                  bg-white
                  border
                  border-black/30
                  appearance-none
                  cursor-ew-resize
                  accent-[#141414]
                  outline-none
                "
              />

            </div>

          </div>

          <!-- Activation -->
          <div class="flex flex-col gap-2">

            <label class="text-[10px] text-[#141414]/70 font-black tracking-widest">
              Activation Function
            </label>

            <select
              value={neurons[activeNeuronIdx].act}
              onchange={(e) =>
                handleNeuronActivationChange(
                  (e.target as HTMLSelectElement).value as Act
                )
              }
              class="
                w-full
                bg-white
                border
                border-black/30
                rounded-2xl
                px-4
                py-3
                text-sm
                text-[#141414]
                focus:outline-none
                transition
                duration-200
                cursor-pointer
                hover:bg-[#fafafa]
              "
            >
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">relu</option>
            </select>

          </div>

        </div>

      </section>

      <!-- TESTING CARD -->
      <section class="bg-white border rounded-3xl p-5 flex flex-col gap-4 shadow-sm">

        <h3 class="text-xs font-black tracking-widest flex items-center gap-2 border-b border-black/30 pb-3">
          <Binary class="w-4 h-4 text-[#F27D26]" />
          Coordinate Evaluation
        </h3>

        <div class="grid grid-cols-2 gap-4">

          <div class="flex flex-col gap-2 bg-[#f5f5f5] border border-black/30 rounded-3xl p-4">

            <span class="text-[10px] font-bold tracking-wider">
              Input x₁
            </span>

            <input
              type="number"
              bind:value={testX1}
              class="
                bg-white
                border
                border-black/30
                rounded-2xl
                px-3
                py-2
                text-sm
                focus:outline-none
              "
            />

          </div>

          <div class="flex flex-col gap-2 bg-[#f5f5f5] border border-black/30 rounded-3xl p-4">

            <span class="text-[10px] font-bold tracking-wider">
              Input x₂
            </span>

            <input
              type="number"
              bind:value={testX2}
              class="
                bg-white
                border
                border-black/30
                rounded-2xl
                px-3
                py-2
                text-sm
                focus:outline-none
              "
            />

          </div>

        </div>

        <!-- Output -->
        <div class="bg-[#f5f5f5] border border-black/30 rounded-2xl px-5 py-4 flex items-center justify-between">

          <div class="flex items-center gap-3">

            <Gauge class="w-5 h-5 text-[#F27D26]" />

            <div>
              <span class="text-[10px] tracking-wider font-black block">
                Output
              </span>

              <span class="text-[11px] text-[#141414]/60">
                at x₁={testX1.toFixed(1)}, x₂={testX2.toFixed(1)}
              </span>
            </div>

          </div>

          <span class="text-2xl font-bold tracking-tight">
            y = {outputVal.toFixed(4)}
          </span>

        </div>

      </section>

    </div>

    <!-- RIGHT PANEL -->
    <div class="lg:col-span-7 flex flex-col gap-6">

      <!-- PLOT -->
      <div class="flex-1 min-h-[380px] flex flex-col bg-white border rounded-[28px] p-5 relative overflow-hidden shadow-sm">

        <ThreeDPlot
          {neurons}
          {bias}
          outputActivation={layerCount === 2 || neuronCount > 1 ? outputActivation : neurons[0]?.act || "tanh"}
          {layerCount}
          layer2Neurons={layerCount === 2 ? layer2Neurons : []}
          {bias2}
        />

      </div>

      <!-- NETWORK -->
      <div class="bg-white border rounded-[28px] p-5 shadow-sm">

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