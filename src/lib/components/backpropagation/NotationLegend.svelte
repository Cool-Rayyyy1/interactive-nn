<script lang="ts">
  import KaTeX from "$lib/components/backpropagation/KaTeX.svelte";
  import type { ActivationType } from '$lib/types';

  let { activationType } = $props<{ activationType: ActivationType }>();

  const symbols = [
    { symbol: 'a_{ij}', meaning: 'Activation of Neuron j in Layer i' },
    { symbol: 'X_{j}', meaning: 'Input feature j' },
    { symbol: 'w_{k}', meaning: 'Weight Parameter k' },
    { symbol: 'b_{k}', meaning: 'Bias Parameter k' },
    { symbol: '\\nabla', meaning: 'Gradient Signal' },
    { symbol: '\\eta', meaning: 'Learning Rate' },
    { symbol: 'y', meaning: 'Target Vector' },
    { symbol: 'L', meaning: 'MSE Loss' }
  ];

  let actSymbol = $derived.by(() => {
    // Add activation function specific symbol
    return activationType === 'sigmoid' ? '\\sigma' : activationType === 'tanh' ? '\\tanh' : '\\text{ReLU}';
  });
</script>

<section class="bg-white overflow-hidden">
  <div class="tech-header">
    <h2 class="tech-label">Reference Manual</h2>
    <span class="text-[10px] text-slate-400 font-mono">DOC_01</span>
  </div>

  <div class="p-6 space-y-8">
    <!-- Activation Function -->
    <div class="bg-slate-50/50 p-4 border border-slate-200">
      <h3 class="tech-label mb-4 text-indigo-600 capitalize">{activationType} & Derivative</h3>
      <div class="text-indigo-900 space-y-4">
        <div class="flex flex-col items-center">
          {#if activationType === 'sigmoid'}
             <KaTeX math={"\\sigma(z) = \\frac{1}{1 + e^{-z}}"} block={true} />
          {:else if activationType === 'tanh'}
             <KaTeX math={"\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}"} block={true} />
          {:else if activationType === 'relu'}
             <KaTeX math={"\\text{ReLU}(z) = \\max(0, z)"} block={true} />
          {/if}
        </div>
        <div class="flex flex-col items-center">
          {#if activationType === 'sigmoid'}
             <KaTeX math={"\\begin{aligned} \\sigma'(z) = \\sigma(z)(1 - \\sigma(z)) \\end{aligned}"} block={true} />
          {:else if activationType === 'tanh'}
             <KaTeX math={"\\begin{aligned} \\tanh'(z) = 1 - \\tanh^2(z) \\end{aligned}"} block={true} />
          {:else if activationType === 'relu'}
             <KaTeX math={"\\begin{aligned} \\text{ReLU}^{\\prime}(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z \\le 0 \\end{cases} \\end{aligned}"} block={true} />
          {/if}
        </div>
      </div>
    </div>

    <!-- Symbols -->
    <div class="grid grid-cols-1 gap-3">
      {#each symbols as sym}
        <div class="flex items-center gap-4 text-xs">
          <div class="w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100 rounded">
            <KaTeX math={sym.symbol} />
          </div>
          <span class="text-slate-500 font-mono text-[10px] uppercase tracking-tight">{sym.meaning}</span>
        </div>
      {/each}
      <div class="flex items-center gap-4 text-xs text-indigo-600">
        <div class="w-12 h-12 flex items-center justify-center bg-indigo-50 border border-indigo-100 rounded">
          <KaTeX math={activationType === 'sigmoid' ? '\\sigma' : activationType === 'tanh' ? '\\tanh' : '\\text{ReLU}'} />
        </div>
        <span class="text-[10px] uppercase tracking-tight font-bold">Selected Activation</span>
      </div>
    </div>
  </div>
</section>
