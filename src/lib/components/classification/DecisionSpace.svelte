<script lang="ts">
  import type { NeuralNetwork } from '$lib/networks/ml-engine';

  let { 
    networkState, 
    nnRef, 
    dataPoints, 
    ongenerateData 
  }: {
    networkState: any;
    nnRef: NeuralNetwork | null;
    dataPoints: { x: number; y: number; label: number }[];
    ongenerateData: () => void;
  } = $props();

  let canvasRef = $state<HTMLCanvasElement | null>(null);

  // --- Dynamic Decision Space Renderer ---
  const drawDecisionBoundary = () => {
    const canvas = canvasRef;
    if (!canvas || !nnRef) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const x = (i / width) * 2 - 1;
        const y = (j / height) * 2 - 1;
        const { outputs } = nnRef.forward([x, y]);
        const prob = outputs[outputs.length - 1][1]; // Probability of class 1

        // Color mapping: Blue (class 0) to Red (class 1)
        const r = Math.floor(255 * prob);
        const b = Math.floor(255 * (1 - prob));
        const g = 100;

        const idx = (j * width + i) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 110; // Transparency
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  // Re-draw when network state, points, or the canvas reference updates
  $effect(() => {
    const _ns = networkState;
    const _dp = dataPoints;
    const _cv = canvasRef;
    drawDecisionBoundary();
  });
</script>

<aside class="lg:col-span-3 p-6 flex flex-col gap-6">
  <div class="flex-1 border border-[#141414] bg-white relative flex flex-col rounded-2xl">
    <div class="p-4 border-b border-[#141414] flex justify-between items-center bg-[#E4E3E0]/30 ">
      <h2 class="text-xs tracking-widest opacity-50">Decision Space</h2>
      <button 
        onclick={ongenerateData}
        class="text-[10px]  hover:underline cursor-pointer"
        id="btn-regen-data"
      >Regenerate Data</button>
    </div>
    
    <div class="flex-1 relative m-4 border border-[#141414]/10 bg-[#E4E3E0]/15">
      <canvas 
        bind:this={canvasRef} 
        width={80} 
        height={80} 
        class="w-full h-full absolute inset-0"
      ></canvas>
      <svg class="w-full h-full absolute inset-0 pointer-events-none" aria-label="Dataset Scatter Plot">
        {#each dataPoints as p}
          <circle 
            cx="{(p.x + 1) * 50}%"
            cy="{(p.y + 1) * 50}%"
            r="4.5"
            fill={p.label === 1 ? '#F27D26' : '#141414'}
            stroke="white"
            stroke-width="1.25"
          />
        {/each}
      </svg>
    </div>

    <div class="p-4 border-t border-[#141414] bg-[#E4E3E0]/30">
      <div class="flex justify-between items-center text-[10px] opacity-50 mb-2">
        <span>Legend</span>
      </div>
      <div class="flex gap-4">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-[#F27D26] rounded-full border border-white"></div>
          <span class="text-[10px] ">Class A</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-[#141414] rounded-full border border-white"></div>
          <span class="text-[10px] ">Class B</span>
        </div>
      </div>
    </div>
  </div>
</aside>
