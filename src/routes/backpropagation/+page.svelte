<script lang="ts">
  import { NeuralNetwork } from '$lib/store/network.svelte';
  import NetworkVisualization from '$lib/components/backpropagation/NetworkVisualization.svelte';
  import TrainingControls from '$lib/components/backpropagation/TrainingControls.svelte';
  import ParameterTable from '$lib/components/backpropagation/ParameterTable.svelte';
  import NotationLegend from '$lib/components/backpropagation/NotationLegend.svelte';
  import MathPanel from '$lib/components/backpropagation/MathPanel.svelte';

  const nn = new NeuralNetwork();
  
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-sans selection:bg-indigo-100 p-4 md:p-4">

  <!--Control bar -->
<div class="max-w-7xl mx-auto mb-8 bg-white border border-slate-200 rounded-xl shadow-sm font-sans">
  
  <!--Header -->
  <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
        <h1 class="text-sm font-bold tracking-[0.1em] text-slate-900 uppercase">Engine Control</h1>
      </div>
          
    </div>

    <div class="flex items-center gap-6">
      <div class="flex flex-col items-end leading-tight">
        <span class="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Current Step</span>
        <span class="text-lg font-mono font-bold text-indigo-600 tabular-nums leading-none">
          {nn.epoch.toString().padStart(4, '0')}
        </span>
      </div>
    </div>
  </div>

  <!-- Control area -->
  <div class="p-5 bg-white">
    <TrainingControls 
      bind:isTraining={nn.isTraining}
      reset={() => nn.reset()}
      handlePrevStep={() => nn.handlePrevStep()}
      handleStep={() => nn.handleStep()}
      stepHistoryLen={nn.stepHistory.length}
      bind:learningRate={nn.learningRate}
      bind:target={nn.target}
      bind:maxEpoch={nn.maxEpoch}
      bind:activationType={nn.activationType}
      bind:x1={nn.x1}
      bind:x2={nn.x2}
    />
  </div>

  
</div>

  <!-- main part -->
  <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- left -->
    <div class="lg:col-span-4 space-y-8">

      <div class="tech-card bg-white border-slate-300 shadow-sm">
        <ParameterTable 
          weights={nn.weights}
          biases={nn.biases}
          activeElement={nn.activeElement}
        />
      </div>

      <div class="tech-card bg-white border-slate-300 shadow-sm">
        <NotationLegend activationType={nn.activationType} />
      </div>

    </div>

    <!-- right -->
    <div class="lg:col-span-8 space-y-8">

      <!-- Visualization -->
      <div class="tech-card bg-white border-slate-300 shadow-sm">
        <div class="tech-header flex justify-between items-center">
          
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full 
              {nn.step === 'forward' ? 'bg-indigo-500 animate-pulse' : 
                nn.step === 'backward' ? 'bg-rose-500 animate-pulse' : 
                nn.step === 'update' ? 'bg-amber-500 animate-pulse' : 
                'bg-slate-300'}">
            </div>

            <span class="tech-label">
              {nn.step === 'idle' ? 'System Ready' : `Current Phase: ${nn.step} propagation`}
            </span>
          </div>

          <div class="tech-label">
            Sub-step: <span class="text-slate-900">{nn.subStep}</span>
          </div>

        </div>

        <div class="p-4 bg-slate-50/50">
          <NetworkVisualization 
            weights={nn.weights}
            biases={nn.biases}
            neuronValues={nn.neuronValues}
            activeElement={nn.activeElement}
            step={nn.step}
            target={nn.target}
          />
        </div>
      </div>

<div class="flex w-full overflow-visible">

  <!-- forward pass -->
  <div class="tech-card flex-1 overflow-visible transition-all duration-300 shadow-sm 
    {nn.step === 'forward' 
      ? 'border-indigo-500 ring-1 ring-indigo-500/10' 
      : 'opacity-60 grayscale-[0.5] border-slate-300'}">

    <div class="tech-header">
      <span class="tech-label">Phase 01</span>
      <span class="font-bold text-xs uppercase tracking-widest text-indigo-600">
        Forward Pass & MSE
      </span>
    </div>

    <div class="p-0 overflow-visible">
      {#if nn.step === 'forward'}
        <div class="overflow-x-auto overflow-y-visible p-2">
          <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
        </div>
      {:else}
        <div class="min-h-[6rem] flex items-center justify-center bg-slate-50/50">
          <p class="tech-label text-slate-400 italic">
            Awaiting forward propagation...
          </p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Backward -->
  <div class="tech-card flex-1 overflow-visible transition-all duration-300 shadow-sm 
    {nn.step === 'backward' 
      ? 'border-rose-500 ring-1 ring-rose-500/10' 
      : 'opacity-60 grayscale-[0.5] border-slate-300'}">

    <div class="tech-header">
      <span class="tech-label">Phase 02</span>
      <span class="font-bold text-xs uppercase tracking-widest text-rose-600">
        The "Blame" Game
      </span>
    </div>

    <div class="p-0 overflow-visible">
      {#if nn.step === 'backward'}
        <div class="overflow-x-auto overflow-y-visible p-2">
          <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
        </div>
      {:else}
        <div class="min-h-[6rem] flex items-center justify-center bg-slate-50/50">
          <p class="tech-label text-slate-400 italic">
            Awaiting error backpropagation...
          </p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Update -->
  <div class="tech-card flex-1 overflow-visible transition-all duration-300 shadow-sm 
    {nn.step === 'update' 
      ? 'border-amber-500 ring-1 ring-amber-500/10' 
      : 'opacity-60 grayscale-[0.5] border-slate-300'}">

    <div class="tech-header">
      <span class="tech-label">Phase 03</span>
      <span class="font-bold text-xs uppercase tracking-widest text-amber-600">
        Gradient Descent
      </span>
    </div>

    <div class="p-0 overflow-visible">
      {#if nn.step === 'update'}
        <div class="overflow-x-auto overflow-y-visible p-2">
          <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
        </div>
      {:else}
        <div class="min-h-[6rem] flex items-center justify-center bg-slate-50/50">
          <p class="tech-label text-slate-400 italic">
            Awaiting parameter updates...
          </p>
        </div>
      {/if}
    </div>
  </div>

</div>
    </div>
  </main>
</div>