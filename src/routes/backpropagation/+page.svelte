<script lang="ts">
  import { NeuralNetwork } from '$lib/store/network.svelte';
  import NetworkVisualization from '$lib/components/backpropagation/NetworkVisualization.svelte';
  import TrainingControls from '$lib/components/backpropagation/TrainingControls.svelte';
  import ParameterTable from '$lib/components/backpropagation/ParameterTable.svelte';
  import NotationLegend from '$lib/components/backpropagation/NotationLegend.svelte';
  import MathPanel from '$lib/components/backpropagation/MathPanel.svelte';

  const nn = new NeuralNetwork();
</script>

<div class="min-h-screen bg-slate-200 text-slate-900 font-sans selection:bg-indigo-100 p-4 md:p-8">
  <header class="max-w-7xl mx-auto mb-8 tech-card bg-white p-8 border-slate-300">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2 academic-title">
          Neural Network <span class="text-indigo-600 italic">Backpropagation</span>
        </h1>
        <p class="text-slate-400 text-sm font-mono max-m-xl">
          An environment for analyzing gradient flow and parameter optimization.
        </p>
      </div>
      <div class="flex items-center gap-6 text-xs tech-label">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          KERNEL_ACTIVE
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          EPOCH: <span class="text-slate-900 font-bold">{nn.epoch}</span>
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Left Panel: Controls & Parameters -->
    <div class="lg:col-span-4 space-y-8">
      <div class="tech-card bg-white border-slate-300 shadow-sm">
        <TrainingControls 
          bind:isTraining={nn.isTraining}
          reset={() => nn.reset()}
          handlePrevStep={() => nn.handlePrevStep()}
          handleStep={() => nn.handleStep()}
          stepHistoryLen={nn.stepHistory.length}
          step={nn.step}
          subStep={nn.subStep}
          bind:learningRate={nn.learningRate}
          bind:target={nn.target}
          bind:maxEpoch={nn.maxEpoch}
          bind:activationType={nn.activationType}
          bind:x1={nn.x1}
          bind:x2={nn.x2}
        />
      </div>

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

    <!-- Right Panel: Visualization & Math -->
    <div class="lg:col-span-8 space-y-8">
      <!-- Visualization Section -->
      <div class="tech-card bg-white border-slate-300 shadow-sm">
        <div class="tech-header">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full {nn.step === 'forward' ? 'bg-indigo-500 animate-pulse' : nn.step === 'backward' ? 'bg-rose-500 animate-pulse' : nn.step === 'update' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}"></div>
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

      <!-- Educational Cards Section -->
      <div class="space-y-8">
        <!-- Forward Pass Card -->
        <div class="tech-card transition-all duration-300 shadow-sm {nn.step === 'forward' ? 'border-indigo-500 ring-1 ring-indigo-500/10' : 'opacity-60 grayscale-[0.5] border-slate-300'}">
          <div class="tech-header">
            <span class="tech-label">Phase 01</span>
            <span class="font-bold text-xs uppercase tracking-widest text-indigo-600">Forward Pass & MSE</span>
          </div>
          <div class="p-0">
            {#if nn.step === 'forward'}
              <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
            {:else}
              <div class="h-24 flex items-center justify-center bg-slate-50/50">
                <p class="tech-label text-slate-400 italic">Awaiting forward propagation...</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Backward Pass Card -->
        <div class="tech-card transition-all duration-300 shadow-sm {nn.step === 'backward' ? 'border-rose-500 ring-1 ring-rose-500/10' : 'opacity-60 grayscale-[0.5] border-slate-300'}">
          <div class="tech-header">
            <span class="tech-label">Phase 02</span>
            <span class="font-bold text-xs uppercase tracking-widest text-rose-600">The "Blame" Game</span>
          </div>
          <div class="p-0">
            {#if nn.step === 'backward'}
              <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
            {:else}
              <div class="h-24 flex items-center justify-center bg-slate-50/50">
                <p class="tech-label text-slate-400 italic">Awaiting error backpropagation...</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Update Card -->
        <div class="tech-card transition-all duration-300 shadow-sm {nn.step === 'update' ? 'border-amber-500 ring-1 ring-amber-500/10' : 'opacity-60 grayscale-[0.5] border-slate-300'}">
          <div class="tech-header">
            <span class="tech-label">Phase 03</span>
            <span class="font-bold text-xs uppercase tracking-widest text-amber-600">Gradient Descent</span>
          </div>
          <div class="p-0">
            {#if nn.step === 'update'}
              <MathPanel symbolicMath={nn.symbolicMath} numericMath={nn.numericMath} />
            {:else}
              <div class="h-24 flex items-center justify-center bg-slate-50/50">
                <p class="tech-label text-slate-400 italic">Awaiting parameter updates...</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>

 
</div>
