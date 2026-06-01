<script lang="ts">
  let { lossHistory }: { lossHistory: { epoch: number; loss: number }[] } = $props();

  const chartWidth = 350;
  const chartHeight = 160;

  let maxLoss = $derived.by(() => {
    if (lossHistory.length === 0) return 1;
    const maxVal = Math.max(...lossHistory.map(d => d.loss));
    return maxVal > 0 ? maxVal * 1.1 : 1;
  });

  const scaleX = (idx: number) => {
    if (lossHistory.length <= 1) return 40;
    return 40 + (idx / (lossHistory.length - 1)) * (chartWidth - 55);
  };

  const scaleY = (val: number) => {
    return chartHeight - 20 - (val / maxLoss) * (chartHeight - 35);
  };

  let pathD = $derived.by(() => {
    if (lossHistory.length === 0) return '';
    return lossHistory.map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${scaleX(idx)} ${scaleY(d.loss)}`).join(' ');
  });
</script>

<section class="h-48" id="section-loss-curve">
  <h2 class="text-xs font-mono uppercase tracking-widest opacity-50 mb-4">Loss Curve</h2>
  <div class="h-full border border-[#141414] bg-white p-2">
    {#if lossHistory.length > 0}
      <svg class="w-full h-full" viewBox="0 0 {chartWidth} {chartHeight}">
        <!-- Y-gridlines and ticks -->
        {#each [0, 0.25, 0.5, 0.75, 1.0] as relativeVal}
          {@const yCoord = scaleY(relativeVal * maxLoss)}
          <line x1="40" y1={yCoord} x2={chartWidth - 15} y2={yCoord} stroke="#efefef" stroke-width="1" />
          <text x="34" y={yCoord + 3} class="text-[8px] font-mono fill-[#141414]/40" text-anchor="end">
            {(relativeVal * maxLoss).toFixed(2)}
          </text>
        {/each}

        <!-- X and Y Axes -->
        <line x1="40" y1="10" x2="40" y2={chartHeight - 20} stroke="#141414" stroke-width="1.25" />
        <line x1="40" y1={chartHeight - 20} x2={chartWidth - 15} y2={chartHeight - 20} stroke="#141414" stroke-width="1.25" />

        <!-- Path line representing loss -->
        {#if pathD}
          <path d={pathD} fill="none" stroke="#141414" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        {/if}

        <!-- Axis Labels -->
        <text x="25" y="15" class="text-[8px] font-mono font-bold fill-[#141414]/60" text-anchor="end">MSE</text>
        <text x={chartWidth - 25} y={chartHeight - 6} class="text-[8px] font-mono font-bold fill-[#141414]/60" text-anchor="end">EPOCHS</text>
      </svg>
    {:else}
      <div class="flex items-center justify-center h-full text-xs font-mono opacity-50">
        Awaiting first training loop...
      </div>
    {/if}
  </div>
</section>
