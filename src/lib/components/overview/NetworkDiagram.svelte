<script lang="ts">
  import type { ONeuron, Layer2Neuron } from '$lib/types';

  interface Props {
    neurons: ONeuron[];
    bias: number;
    outputActivation: string;
    layerCount?: number;
    layer2Neurons?: Layer2Neuron[];
    bias2?: number;
  }

  let {
    neurons = [],
    bias = 0,
    outputActivation = "tanh",
    layerCount = 1,
    layer2Neurons = [],
    bias2 = 0
  }: Props = $props();

  let neuronCount = $derived(neurons.length);
  let layer2NeuronCount = $derived(layer2Neurons.length);

  // Calculate corresponding relative Y positions for hidden layer neurons
  const getNeuronY = (idx: number, total: number) => {
    if (total === 1) return 130;
    if (total === 2) return idx === 0 ? 80 : 180;
    return 50 + idx * 80;
  };
</script>

<div class="w-full bg-white select-none">
  <div class="flex justify-between items-center mb-3 pb-2 border-b-2 border-[#141414] border-black/30">
    <h4 class="text-xs font-black text-[#141414] uppercase tracking-widest">
      Network Architecture Diagram
    </h4>
    <span class="text-[9px] text-[#141414]/70 uppercase tracking-wide ">
      {#if layerCount === 2}
        L1: {neuronCount} {neuronCount === 1 ? "Node" : "Nodes"} | L2: {layer2NeuronCount} {layer2NeuronCount === 1 ? "Node" : "Nodes"}
      {:else}
        Layer h: {neuronCount} {neuronCount === 1 ? "Node" : "Nodes"} | bias b
      {/if}
    </span>
  </div>

  <div class="flex justify-center items-center py-4 h-[390px] border border-dashed border-[#141414]/30 bg-[#E4E3E0]/25">
    <svg
      viewBox="0 0 650 270"
      class="w-full h-full max-h-[360px]"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <!-- Standard Ink Black marker -->
        <marker
          id="arrow-ink"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#141414" />
        </marker>
        <!-- Vibrant safety orange marker -->
        <marker
          id="arrow-accent"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#F27D26" />
        </marker>
      </defs>

      <!-- TWO LAYERS MODE RENDERING -->
      {#if layerCount === 2}
        <!-- WIRES: Layer 1 to Layer 2 Connections -->
        {#each layer2Neurons.slice(0, layer2NeuronCount) as neu2, idx2}
          {@const ny2 = getNeuronY(idx2, layer2NeuronCount)}
          {#each neurons.slice(0, neuronCount) as neu1, idx1}
            {@const ny1 = getNeuronY(idx1, neuronCount)}
            {@const wVal = idx1 === 0 ? neu2.v1 : idx1 === 1 ? neu2.v2 : neu2.v3}
            {@const t = idx1 === 0 ? 0.32 : idx1 === 1 ? 0.52 : 0.70}
            {@const xBubble = 210 + (380 - 210) * t}
            {@const yBubble = ny1 + (ny2 - ny1) * t}
            <g>
              <line
                x1="210"
                y1={ny1}
                x2="365"
                y2={ny2}
                stroke="#141414"
                stroke-width="1.2"
                opacity="0.85"
                marker-end="url(#arrow-ink)"
              />
              <!-- Weight Bubble -->
              <rect
                x={xBubble - 15}
                y={yBubble - 6}
                width="30"
                height="11"
                fill="#FFFFFF"
                stroke="#141414"
                stroke-width="0.8"
              />
              <text
                x={xBubble}
                y={yBubble + 2.5}
                fill="#F27D26"
                font-size="7"
                font-weight="bold"
                text-anchor="middle"
              >
                {wVal >= 0 ? `+${wVal.toFixed(1)}` : wVal.toFixed(1)}
              </text>
            </g>
          {/each}
        {/each}

        <!-- WIRES: Inputs to Layer 1 Connections -->
        {#each neurons.slice(0, neuronCount) as neu, idx}
          {@const ny = getNeuronY(idx, neuronCount)}
          {@const xS = 60}
          {@const xD = 195}
          {@const t1 = 0.35}
          {@const t2 = 0.65}
          {@const yS1 = 65}
          {@const yD1 = ny - 6}
          {@const xBubble1 = xS + (xD - xS) * t1}
          {@const yBubble1 = yS1 + (yD1 - yS1) * t1}
          {@const yS2 = 135}
          {@const yD2 = ny}
          {@const xBubble2 = xS + (xD - xS) * t2}
          {@const yBubble2 = yS2 + (yD2 - yS2) * t2}
          <g>
            <!-- Input 1 -> L1 Node -->
            <line
              x1={xS}
              y1={yS1}
              x2={xD}
              y2={yD1}
              stroke="#141414"
              stroke-width="1.5"
              marker-end="url(#arrow-ink)"
            />
            <rect
              x={xBubble1 - 18}
              y={yBubble1 - 6}
              width="36"
              height="12"
              fill="#FFFFFF"
              stroke="#141414"
              stroke-width="0.8"
            />
            <text
              x={xBubble1}
              y={yBubble1 + 2.5}
              fill="#141414"
              font-size="7.5"
              font-weight="black"
              text-anchor="middle"
            >
              {neu.w1 >= 0 ? `+${neu.w1.toFixed(1)}` : neu.w1.toFixed(1)}
            </text>

            <!-- Input 2 -> L1 Node -->
            <line
              x1={xS}
              y1={yS2}
              x2={xD}
              y2={yD2}
              stroke="#141414"
              stroke-width="1.5"
              marker-end="url(#arrow-ink)"
            />
            <rect
              x={xBubble2 - 18}
              y={yBubble2 - 6}
              width="36"
              height="12"
              fill="#FFFFFF"
              stroke="#141414"
              stroke-width="0.8"
            />
            <text
              x={xBubble2}
              y={yBubble2 + 2.5}
              fill="#F27D26"
              font-size="7.5"
              font-weight="black"
              text-anchor="middle"
            >
              {neu.w2 >= 0 ? `+${neu.w2.toFixed(1)}` : neu.w2.toFixed(1)}
            </text>

            <!-- Bias1 -> Layer 1 node -->
            <line
              x1="60"
              y1="200"
              x2="195"
              y2={ny + 6}
              stroke="#141414"
              stroke-dasharray="3, 1.5"
              stroke-width="1"
              marker-end="url(#arrow-ink)"
            />
          </g>
        {/each}

        <!-- WIRES: Layer 2 Bias bias2 -> Layer 2 Nodes -->
        {#each layer2Neurons.slice(0, layer2NeuronCount) as _, idx}
          {@const ny2 = getNeuronY(idx, layer2NeuronCount)}
          <line
            x1="210"
            y1="240"
            x2="365"
            y2={ny2 + 6}
            stroke="#141414"
            stroke-dasharray="3, 1.5"
            stroke-width="1"
            marker-end="url(#arrow-ink)"
          />
        {/each}

        <!-- INPUT NODES COLUMN -->
        <!-- Node X1 -->
        <circle cx="60" cy="65" r="16" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
        <text x="60" y="69" fill="#141414" font-size="11" font-weight="black" text-anchor="middle">
          x₁
        </text>

        <!-- Node X2 -->
        <circle cx="60" cy="135" r="16" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
        <text x="60" y="139" fill="#141414" font-size="11"  font-weight="black" text-anchor="middle">
          x₂
        </text>

        <!-- Node Bias 1 -->
        <circle cx="60" cy="200" r="16" fill="#E4E3E0" stroke="#141414" stroke-width="2" />
        <text x="60" y="204" fill="#141414" font-size="11"  font-weight="black" text-anchor="middle">
          b₁
        </text>
        <rect x="80" y="193" width="31" height="12" fill="#FFFFFF" stroke="#141414" stroke-width="1" />
        <text x="95" y="201" fill="#F27D26" font-size="7.5"  font-weight="black" text-anchor="middle">
          {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)}
        </text>

        <!-- LAYER 1 NODES COLUMN -->
        {#each neurons.slice(0, neuronCount) as neu, idx}
          {@const ny = getNeuronY(idx, neuronCount)}
          <g>
            <circle cx="210" cy={ny} r="18" fill="#E4E3E0" stroke="#141414" stroke-width="2" />
            <text x="210" y={ny + 2} fill="#141414" font-size="8" font-weight="black"  text-anchor="middle">
              h₁_{idx + 1}
            </text>
            <text x="210" y={ny + 10} fill="#F27D26" font-size="5.5" font-weight="bold"  text-anchor="middle">
              {neu.act}
            </text>
          </g>
        {/each}

        <!-- Node Bias 2 -->
        <circle cx="210" cy="240" r="14" fill="#E4E3E0" stroke="#141414" stroke-width="2" />
        <text x="210" y="244" fill="#141414" font-size="9"  font-weight="black" text-anchor="middle">
          b₂
        </text>
        <rect x="228" y="233" width="31" height="12" fill="#FFFFFF" stroke="#141414" stroke-width="1" />
        <text x="243" y="241" fill="#F27D26" font-size="7.5"  font-weight="black" text-anchor="middle">
          {bias2 >= 0 ? `+${bias2.toFixed(1)}` : bias2.toFixed(1)}
        </text>

        <!-- LAYER 2 NODES COLUMN -->
        {#each layer2Neurons.slice(0, layer2NeuronCount) as neu2, idx}
          {@const ny2 = getNeuronY(idx, layer2NeuronCount)}
          <g>
            <circle cx="380" cy={ny2} r="18" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
            <text x="380" y={ny2 + 2} fill="#141414" font-size="8" font-weight="black"  text-anchor="middle">
              h₂_{idx + 1}
            </text>
            <text x="380" y={ny2 + 10} fill="#F27D26" font-size="5.5" font-weight="bold"  text-anchor="middle">
              {neu2.act}
            </text>
          </g>
        {/each}

        <!-- LAYER 2 TO FINAL OUTPUT ACTIVATIONS -->
        {#if layer2NeuronCount > 1}
          <!-- Connect layer 2 to Summation -->
          {#each layer2Neurons.slice(0, layer2NeuronCount) as _, idx}
            {@const ny2 = getNeuronY(idx, layer2NeuronCount)}
            <line
              x1="398"
              y1={ny2}
              x2="455"
              y2="130"
              stroke="#F27D26"
              stroke-width="1.5"
              marker-end="url(#arrow-accent)"
            />
          {/each}
          
          <!-- Summation node -->
          <circle cx="470" cy="130" r="15" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
          <text x="470" y="134.5" fill="#141414" font-size="12"  font-weight="black" text-anchor="middle">
            ∑
          </text>

          <!-- Summation to final activation -->
          <line
            x1="485"
            y1="130"
            x2="515"
            y2="130"
            stroke="#F27D26"
            stroke-width="1.5"
            marker-end="url(#arrow-accent)"
          />

          <!-- Combiner activation box -->
          <rect
            x="520"
            y="110"
            width="48"
            height="40"
            fill="#E4E3E0"
            stroke="#141414"
            stroke-width="2"
          />
          <text x="544" y="125" fill="#141414" font-size="7.5"  font-weight="black" text-anchor="middle">
            COMB(G)
          </text>
          <text x="544" y="139" fill="#F27D26" font-size="9.5" font-weight="bold" text-anchor="middle" >
            {outputActivation}
          </text>

          <!-- Activator box to final output -->
          <line
            x1="568"
            y1="130"
            x2="582"
            y2="130"
            stroke="#141414"
            stroke-width="1.5"
            marker-end="url(#arrow-ink)"
          />
        {:else}
          <!-- Single layer 2 node maps directly to output y via activation box -->
          <line
            x1="398"
            y1="130"
            x2="470"
            y2="130"
            stroke="#F27D26"
            stroke-width="1.5"
            marker-end="url(#arrow-accent)"
          />

          <!-- Combiner activation box -->
          <rect
            x="475"
            y="108"
            width="95"
            height="44"
            fill="#E4E3E0"
            stroke="#141414"
            stroke-width="2"
          />
          <text x="522.5" y="124" fill="#141414" font-size="7.5"  font-weight="black" text-anchor="middle">
            OUTPUT ACT(G)
          </text>
          <text x="522.5" y="140" fill="#F27D26" font-size="11" font-weight="black" text-anchor="middle" >
            {outputActivation}
          </text>

          <line
            x1="570"
            y1="130"
            x2="582"
            y2="130"
            stroke="#141414"
            stroke-width="1.5"
            marker-end="url(#arrow-ink)"
          />
        {/if}
      {:else}
        <!-- LAYER COUNT 1 STANDARD RENDERING -->
        {#each neurons as neu, idx}
          {@const ny = getNeuronY(idx, neuronCount)}
          {@const xS = 80}
          {@const xD = 245}
          {@const t1 = 0.35}
          {@const t2 = 0.65}
          {@const yS1 = 60}
          {@const yD1 = ny - 6}
          {@const xBubble1 = xS + (xD - xS) * t1}
          {@const yBubble1 = yS1 + (yD1 - yS1) * t1}
          {@const yS2 = 130}
          {@const yD2 = ny}
          {@const xBubble2 = xS + (xD - xS) * t2}
          {@const yBubble2 = yS2 + (yD2 - yS2) * t2}
          <g>
            <line
              x1={xS}
              y1={yS1}
              x2={xD}
              y2={yD1}
              stroke="#141414"
              stroke-width="1.5"
              marker-end="url(#arrow-ink)"
            />
            <rect
              x={xBubble1 - 20}
              y={yBubble1 - 7}
              width="40"
              height="13"
              fill="#FFFFFF"
              stroke="#141414"
              stroke-width="1"
            />
            <text
              x={xBubble1}
              y={yBubble1 + 3}
              fill="#141414"
              font-size="8"
              
              font-weight="black"
              text-anchor="middle"
            >
              {neu.w1 >= 0 ? `+${neu.w1.toFixed(1)}` : neu.w1.toFixed(1)}
            </text>

            <line
              x1={xS}
              y1={yS2}
              x2={xD}
              y2={yD2}
              stroke="#141414"
              stroke-width="1.5"
              marker-end="url(#arrow-ink)"
            />
            <rect
              x={xBubble2 - 20}
              y={yBubble2 - 7}
              width="40"
              height="13"
              fill="#FFFFFF"
              stroke="#141414"
              stroke-width="1"
            />
            <text
              x={xBubble2}
              y={yBubble2 + 3}
              fill="#F27D26"
              font-size="8"
              
              font-weight="black"
              text-anchor="middle"
            >
              {neu.w2 >= 0 ? `+${neu.w2.toFixed(1)}` : neu.w2.toFixed(1)}
            </text>

            <line
              x1="80"
              y1="200"
              x2="245"
              y2={ny + 6}
              stroke="#141414"
              stroke-dasharray="3, 1.5"
              stroke-width="1"
              marker-end="url(#arrow-ink)"
            />
          </g>
        {/each}

        <!-- INPUT NODES COLUMN -->
        <circle cx="80" cy="60" r="18" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
        <text x="80" y="64" fill="#141414" font-size="11"  font-weight="black" text-anchor="middle">
          x₁
        </text>

        <circle cx="80" cy="130" r="18" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
        <text x="80" y="134" fill="#141414" font-size="11"  font-weight="black" text-anchor="middle">
          x₂
        </text>

        <circle cx="80" cy="200" r="18" fill="#E4E3E0" stroke="#141414" stroke-width="2" />
        <text x="80" y="204" fill="#141414" font-size="11"  font-weight="black" text-anchor="middle">
          b
        </text>
        <rect x="104" y="193" width="36" height="13" fill="#FFFFFF" stroke="#141414" stroke-width="1" />
        <text x="122" y="202" fill="#F27D26" font-size="8"  font-weight="black" text-anchor="middle">
          {bias >= 0 ? `+${bias.toFixed(1)}` : bias.toFixed(1)}
        </text>

        <!-- HIDDEN / SINGLE NEURONS COLUMN -->
        {#each neurons as neu, idx}
          {@const ny = getNeuronY(idx, neuronCount)}
          <g>
            <circle cx="260" cy={ny} r="20" fill="#E4E3E0" stroke="#141414" stroke-width="2" />
            <text x="260" y={ny + 2} fill="#141414" font-size="9" font-weight="black"  text-anchor="middle">
              h_{idx + 1}
            </text>
            <text x="260" y={ny + 11} fill="#F27D26" font-size="6.5" font-weight="bold"  text-anchor="middle">
              {neu.act}
            </text>
          </g>
        {/each}

        <!-- HIDDEN TO OUTPUT LAYER INTEGRATIONS -->
        {#if neuronCount > 1}
          {#each neurons as _, idx}
            {@const ny = getNeuronY(idx, neuronCount)}
            <line
              x1="280"
              y1={ny}
              x2="400"
              y2="130"
              stroke="#F27D26"
              stroke-width="1.5"
              marker-end="url(#arrow-accent)"
            />
          {/each}

          <circle cx="420" cy="130" r="18" fill="#FFFFFF" stroke="#141414" stroke-width="2" />
          <text x="420" y="135" fill="#141414" font-size="15"  font-weight="black" text-anchor="middle">
            ∑
          </text>

          <line
            x1="438"
            y1="130"
            x2="482"
            y2="130"
            stroke="#F27D26"
            stroke-width="1.5"
            marker-end="url(#arrow-accent)"
          />

          <rect
            x="490"
            y="108"
            width="64"
            height="44"
            fill="#E4E3E0"
            stroke="#141414"
            stroke-width="2"
          />
          <text x="522" y="126" fill="#141414" font-size="8"  font-weight="black" text-anchor="middle">
            ACT (G)
          </text>
          <text x="522" y="140" fill="#F27D26" font-size="10" font-weight="black" text-anchor="middle" >
            {outputActivation}
          </text>

          <line
            x1="554"
            y1="130"
            x2="572"
            y2="130"
            stroke="#141414"
            stroke-width="1.5"
            marker-end="url(#arrow-ink)"
          />
        {:else}
          <line
            x1="280"
            y1="130"
            x2="480"
            y2="130"
            stroke="#F27D26"
            stroke-width="1.5"
            marker-end="url(#arrow-accent)"
          />

          <rect
            x="440"
            y="108"
            width="110"
            height="44"
            fill="#E4E3E0"
            stroke="#141414"
            stroke-width="2"
          />
          <text x="495" y="124" fill="#141414" font-size="8"  font-weight="black" text-anchor="middle">
            PERCEPTRON ACT(F)
          </text>
          <text x="495" y="140" fill="#F27D26" font-size="11" font-weight="black" text-anchor="middle" >
            {neurons[0]?.act || "sign"}
          </text>

          <line
            x1="550"
            y1="130"
            x2="572"
            y2="130"
            stroke="#141414"
            stroke-width="1.5"
            marker-end="url(#arrow-ink)"
          />
        {/if}
      {/if}

      <!-- FINAL OUTPUT NODE -->
      <circle cx="600" cy="130" r="18" fill="#F27D26" stroke="#141414" stroke-width="2.5" />
      <text x="600" y="135" fill="#141414" font-size="12"  font-weight="black" text-anchor="middle">
        y
      </text>
    </svg>
  </div>
</div>
