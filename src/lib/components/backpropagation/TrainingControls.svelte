<script lang="ts">
  import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Settings2 } from 'lucide-svelte';  
  const activationOptions = ['sigmoid', 'tanh', 'relu'];

  let { 
    isTraining = $bindable(), 
    reset, 
    handlePrevStep, 
    handleStep, 
    stepHistoryLen, 
    learningRate = $bindable(), 
    target = $bindable(), 
    maxEpoch = $bindable(), 
    activationType = $bindable(),
    x1 = $bindable(),
    x2 = $bindable()
  } = $props();
</script>

<div class="flex flex-wrap items-end gap-6 text-xs font-medium">

  <!-- engine command -->
  <div class="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-lg">
    <button
      onclick={() => isTraining = !isTraining}
      class="flex items-center gap-2 px-4 py-2 text-white transition-all rounded-md {isTraining ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'}"
    >
      {#if isTraining}
        <Pause size={16} strokeWidth={2.5} />
        <span>PAUSE</span>
      {:else}
        <Play size={16} strokeWidth={2.5} />
        <span>TRAIN</span>
      {/if}
    </button>

    <div class="flex items-center gap-1 ml-1 font-mono">
      <button
        onclick={handleStep}
        disabled={isTraining}
        title="Step Forward"
        class="p-2 text-slate-600 border border-slate-200 rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={18} />
      </button>

      <button
        onclick={handlePrevStep}
        disabled={isTraining || stepHistoryLen === 0}
        title="Step backward"
        class="p-2 text-slate-600 border border-slate-200 rounded hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onclick={reset}
        title="Reset Engine"
        class="p-2 text-rose-600 border border-rose-100 bg-rose-50 rounded hover:bg-rose-100"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  </div>

  <!-- param. -->
    <div class="flex flex-wrap items-center gap-4 py-1 ml-auto">
    
    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] tracking-wider text-slate-500 font-bold flex items-center gap-1">
        <Settings2 size={10} /> Learning Rate
      </label>
      <input
        type="number"
        step="0.01"
        bind:value={learningRate}
        class="w-30 px-2 py-1.5 bg-white border border-slate-200 rounded font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] tracking-wider text-slate-500 font-bold">Target (y)</label>
      <input type="number" step="0.1" bind:value={target}
        class="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded font-mono" />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] tracking-wider text-slate-500 font-bold">Max Epoch</label>
      <input type="number" bind:value={maxEpoch}
        class="w-20 px-2 py-1.5 bg-white border border-slate-200 rounded font-mono" />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[10px]  tracking-wider text-slate-500 font-bold">Activation</label>
      <select bind:value={activationType}
        class="w-24 px-2 py-1.5 bg-white border border-slate-200 rounded text-xs appearance-none cursor-pointer hover:border-slate-300">
        {#each activationOptions as opt}
          <option value={opt}>{opt.toUpperCase()}</option>
        {/each}
      </select>
    </div>

    <div class="w-px h-8 bg-slate-200 mx-1"></div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] tracking-wider text-slate-500 font-bold">Input x₁</label>
      <input type="number" step="0.1" bind:value={x1}
        class="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono" />
    </div>

    <div class="flex flex-col gap-1.5">
      <label class="text-[10px]  tracking-wider text-slate-500 font-bold">Input x₂</label>
      <input type="number" step="0.1" bind:value={x2}
        class="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono" />
    </div>

  </div>
</div>