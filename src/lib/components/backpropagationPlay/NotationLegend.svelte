<script lang="ts">
  import type { ActivationType } from '$lib/types';
  import Latex from './Latex.svelte';

  interface Props {
    activationType: ActivationType;
  }

  let { activationType }: Props = $props();

  let symbols = $derived([
    { symbol: 'a_{ij}', meaning: 'Activation of Neuron j in Layer i' },
    { symbol: 'X_{j}', meaning: 'Input feature j' },
    { symbol: 'w_{k}', meaning: 'Weight Parameter k' },
    { symbol: 'b_{k}', meaning: 'Bias Parameter k' },
    { symbol: activationType === 'sigmoid' ? '\\sigma' : activationType === 'tanh' ? '\\tanh' : '\\text{ReLU}', meaning: 'Activation Function' },
    { symbol: '\\nabla', meaning: 'Gradient Signal' },
    { symbol: '\\eta', meaning: 'Learning Rate' },
    { symbol: 'y', meaning: 'Target Vector' },
    { symbol: '\\hat{y}', meaning: 'Prediction' },
  ]);
</script>

<section class="bg-white overflow-hidden" id="notation-legend">
  <div class="tech-header bg-[#f5f5f5] border-[#141414] p-3 flex justify-between items-center">
    <h2 class=" text-xs  font-bold tracking-wider">Reference Manual</h2>
  </div>
  
  <div class="p-6 space-y-8 bg-white">
    <!-- Activation Function -->
    <div class="bg-[#f5f5f5] p-4 border border-[#141414] rounded-2xl">
      <h3 class="text-[10px]  tracking-wider  font-bold text-[#F27D26] mb-4 capitalize">
        {activationType} Function & Derivative
      </h3>
      <div class="text-[#141414] space-y-4">
        <div class="flex flex-col items-center">
          {#if activationType === 'sigmoid'}
            <Latex math={`\\sigma(z) = \\frac{1}{1 + e^{-z}}`} />
          {:else if activationType === 'tanh'}
            <Latex math={`\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}`} />
          {:else if activationType === 'relu'}
            <Latex math={`\\text{ReLU}(z) = \\max(0, z)`} />
          {/if}
        </div>
        <div class="flex flex-col items-center">
          {#if activationType === 'sigmoid'}
            <Latex math={`\\begin{aligned} \\sigma'(z) = \\sigma(z)(1 - \\sigma(z)) \\end{aligned}`} />
          {:else if activationType === 'tanh'}
            <Latex math={`\\begin{aligned} \\tanh'(z) = 1 - \\tanh^2(z) \\end{aligned}`} />
          {:else if activationType === 'relu'}
            <Latex math={`\\begin{aligned} \\text{ReLU}^{\\prime}(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z \\le 0 \\end{cases} \\end{aligned}`} />
          {/if}
        </div>
      </div>
    </div>

    <!-- Symbol Legend -->
    <div class="grid grid-cols-1 gap-4">
      <h3 class="text-[10px] font-bold  tracking-widest text-[#141414]/60 ">Notations</h3>
      <div class="grid grid-cols-1 gap-y-3">
        {#each symbols as item}
          <div class="flex items-center gap-3 text-[11px] ">
            <span class="font-bold text-[#141414] bg-[#f5f5f5] border border-[#141414] w-[48px] h-7 flex items-center justify-center">
              <Latex math={item.symbol}/>
            </span>
            <span class="text-[#141414]/70  tracking-wide text-[10px]  leading-none">{item.meaning}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
