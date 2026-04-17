<script lang="ts">
  import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity } from 'lucide-svelte';
  import type { TrainingStep, ActivationType } from '$lib/types';

  let { 
    isTraining = $bindable(), 
    reset, 
    handlePrevStep, 
    handleStep, 
    stepHistoryLen, 
    step, 
    subStep, 
    learningRate = $bindable(), 
    target = $bindable(), 
    maxEpoch = $bindable(), 
    activationType = $bindable(),
    x1 = $bindable(),
    x2 = $bindable() 
  } = $props<{
    isTraining: boolean;
    reset: () => void;
    handlePrevStep: () => void;
    handleStep: () => void;
    stepHistoryLen: number;
    step: TrainingStep;
    subStep: number;
    learningRate: number;
    target: number;
    maxEpoch: number;
    activationType: ActivationType;
    x1: number;
    x2: number;
  }>();
</script>

<section class="bg-white overflow-hidden">
  <div class="tech-header">
    <h2 class="tech-label flex items-center gap-2">
      <Activity class="w-3 h-3" /> Engine Control
    </h2>
    <span class="text-[10px] text-slate-400 font-mono">LIVE_KERNEL</span>
  </div>
  
  <div class="p-6 space-y-6">
    <div class="flex gap-2">
      <button 
        onclick={() => isTraining = !isTraining}
        class="flex-1 py-2 px-4 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border {isTraining ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' : 'bg-indigo-600 border-indigo-700 text-white hover:bg-indigo-700'}"
      >
        {#if isTraining}
          <Pause class="w-4 h-4" /> Halt
        {:else}
          <Play class="w-4 h-4" /> Execute
        {/if}
      </button>
      <button 
        onclick={reset}
        class="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        title="Reset Kernel"
      >
        <RotateCcw class="w-4 h-4" />
      </button>
    </div>

    <div class="flex gap-2">
      <button 
        onclick={handlePrevStep}
        disabled={isTraining || stepHistoryLen === 0}
        class="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30"
        title="Step Back"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
      <button 
        onclick={handleStep}
        disabled={isTraining}
        class="flex-1 py-2 px-4 border border-slate-200 text-slate-700 font-mono text-[10px] uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ChevronRight class="w-4 h-4" />
        Step: {step === 'idle' ? 'Init' : step === 'forward' ? `Fwd (${subStep + 1}/6)` : step === 'backward' ? `Bwd (${subStep + 1}/4)` : `Upd (${subStep + 1}/15)`}
      </button>
    </div>

    <div class="pt-6 border-t border-slate-100 space-y-6">
      <div>
        <label class="tech-label mb-3 block flex justify-between" for="lr">
          Learning Rate (η) <span class="text-indigo-600">{learningRate.toFixed(2)}</span>
        </label>
        <input 
          id="lr"
          type="range" min="0.01" max="1" step="0.01" 
          bind:value={learningRate} 
          class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>
      
      <div>
        <label class="tech-label mb-3 block flex justify-between" for="x1">
          Input X₁ <span class="text-indigo-600">{x1.toFixed(2)}</span>
        </label>
        <input 
          id="x1"
          type="range" min="0" max="1" step="0.05" 
          bind:value={x1} 
          class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div>
        <label class="tech-label mb-3 block flex justify-between" for="x2">
          Input X₂ <span class="text-indigo-600">{x2.toFixed(2)}</span>
        </label>
        <input 
          id="x2"
          type="range" min="0" max="1" step="0.05" 
          bind:value={x2} 
          class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div>
        <label class="tech-label mb-3 block flex justify-between" for="target">
          Target Vector (y) <span class="text-indigo-600">{target.toFixed(2)}</span>
        </label>
        <input 
          id="target"
          type="range" min="0" max="1" step="0.05" 
          bind:value={target} 
          class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div>
        <label class="tech-label mb-3 block flex justify-between" for="maxEpoch">
          Max Epochs <span class="text-indigo-600">{maxEpoch}</span>
        </label>
        <input 
          id="maxEpoch"
          type="range" min="1" max="100" step="1" 
          bind:value={maxEpoch} 
          class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </div>

      <div class="pt-4">
        <span class="tech-label mb-3 block">Activation Function</span>
        <div class="grid grid-cols-3 gap-2">
          {#each ['sigmoid', 'tanh', 'relu'] as type}
            <button
              onclick={() => activationType = type as ActivationType}
              class="py-1.5 px-2 text-[10px] font-mono border transition-all uppercase tracking-tight {activationType === type ? 'bg-indigo-600 border-indigo-700 text-white font-bold' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'}"
            >
              {type}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>
