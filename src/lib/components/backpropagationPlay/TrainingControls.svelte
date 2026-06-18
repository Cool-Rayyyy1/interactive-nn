<script lang="ts">
  import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { TrainingStep, ActivationType } from '$lib/types';
  import { cn } from '$lib/utils';

  interface Props {
    isTraining: boolean;
    setIsTraining: (val: boolean) => void;
    reset: () => void;
    handlePrevStep: () => void;
    handleStep: () => void;
    stepHistoryLen: number;
    step: TrainingStep;
    subStep: number;
    learningRate: number;
    setLearningRate: (val: number) => void;
    target: number;
    setTarget: (val: number) => void;
    maxEpoch: number;
    setMaxEpoch: (val: number) => void;
    activationType: ActivationType;
    setActivationType: (val: ActivationType) => void;
    x1: number;
    setX1: (val: number) => void;
    x2: number;
    setX2: (val: number) => void;
  }

  let {
    isTraining,
    setIsTraining,
    reset,
    handlePrevStep,
    handleStep,
    stepHistoryLen,
    step,
    subStep,
    learningRate,
    setLearningRate,
    target,
    setTarget,
    maxEpoch,
    setMaxEpoch,
    activationType,
    setActivationType,
    x1,
    setX1,
    x2,
    setX2
  }: Props = $props();
</script>

<section class="bg-white" id="training-controls">
  <!-- Control Deck Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Play/Pause/Steps panel -->
    <div class="lg:col-span-11 xl:col-span-5 space-y-4">
      <span class=" text-[10px]  font-bold tracking-wider block text-[#141414]/60">
        Engine Commands (Interrupt / Cycle)
      </span>
      
      <div class="flex gap-3">
        <button 
          onclick={() => setIsTraining(!isTraining)}
          class={cn(
            "flex-1 py-3 px-4  text-xs  tracking-wider transition-all flex items-center justify-center gap-2 border border-[#141414] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer rounded-2xl",
            isTraining 
              ? "bg-[#141414] text-[#E4E3E0] hover:bg-[#141414]/90" 
              : "bg-[#F27D26] text-white hover:bg-[#F27D26]/90"
          )}
        >
          {#if isTraining}
            <Pause class="w-4 h-4" />
          {:else}
            <Play class="w-4 h-4" />
          {/if}
          {isTraining ? "Halt training" : "Execute training"}
        </button>
        
        <button 
          onclick={reset}
          class="p-3 border border-[#141414] bg-white text-[#141414] hover:bg-[#E4E3E0] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer rounded-2xl"
          title="Reset Model Weights"
        >
          <RotateCcw class="w-4 h-4" />
        </button>
      </div>

      <div class="flex gap-3">
        <button 
          onclick={handlePrevStep}
          disabled={isTraining || stepHistoryLen === 0}
          class="p-3 border border-[#141414] bg-white text-[#141414] hover:bg-[#E4E3E0] disabled:opacity-30 disabled:pointer-events-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer rounded-2xl"
          title="Step Backward"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>
        
        <button 
          onclick={handleStep}
          disabled={isTraining}
          class="flex-1 py-3 px-4 border border-[#141414] bg-white text-[#141414]  rounded-2xl text-xs  tracking-wider hover:bg-[#E4E3E0] disabled:opacity-50 flex items-center justify-center gap-2  active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
        >
          <ChevronRight class="w-4 h-4" />
          <span>
            Step: {step === 'idle' ? 'initialize' : step === 'forward' ? `fwd (${subStep}/6)` : step === 'backward' ? `bwd (${subStep}/4)` : `upd (${subStep}/15)`}
          </span>
        </button>
      </div>
    </div>

    <!-- Sliders Grid -->
    <div class="lg:col-span-11 xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      
      <div>
        <span class=" mb-1.5 flex justify-between  text-[10px] text-[#141414]/70">
          Learning Rate (η) <span class="font-bold text-[#F27D26] tabular-nums ">{learningRate.toFixed(2)}</span>
        </span>
        <input 
          type="range" min="0.01" max="1" step="0.01" 
          value={learningRate} 
          oninput={(e) => setLearningRate(parseFloat(e.currentTarget.value))}
          class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D26] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#141414]"
        />
      </div>

      <div>
        <span class=" mb-1.5 flex justify-between  text-[10px] text-[#141414]/70">
          Target (y) <span class="font-bold text-[#F27D26] tabular-nums ">{target.toFixed(2)}</span>
        </span>
        <input 
          type="range" min="0" max="1" step="0.05" 
          value={target} 
          oninput={(e) => setTarget(parseFloat(e.currentTarget.value))}
          class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D26] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#141414]"
        />
      </div>

      <div>
        <span class=" mb-1.5 flex justify-between  text-[10px] text-[#141414]/70">
          Input x₁ <span class="font-bold text-[#F27D26] tabular-nums ">{x1.toFixed(2)}</span>
        </span>
        <input 
          type="range" min="0" max="1" step="0.05" 
          value={x1} 
          oninput={(e) => setX1(parseFloat(e.currentTarget.value))}
          class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D26] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#141414]"
        />
      </div>

      <div>
        <span class=" mb-1.5 flex justify-between  text-[10px] text-[#141414]/70">
          Input x₂ <span class="font-bold text-[#F27D26] tabular-nums ">{x2.toFixed(2)}</span>
        </span>
        <input 
          type="range" min="0" max="1" step="0.05" 
          value={x2} 
          oninput={(e) => setX2(parseFloat(e.currentTarget.value))}
          class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D26] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#141414]"
        />
      </div>

      <div>
        <span class=" mb-1.5 flex justify-between  text-[10px] text-[#141414]/70">
          Max Epoch Limit <span class="font-bold text-[#F27D26] tabular-nums ">{maxEpoch}</span>
        </span>
        <input 
          type="range" min="1" max="100" step="1" 
          value={maxEpoch} 
          oninput={(e) => setMaxEpoch(parseInt(e.currentTarget.value))}
          class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#F27D26] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[#141414]"
        />
      </div>

      <div>
        <span class=" mb-1.5 block  text-[10px] text-[#141414]/70 ">Activation Functions</span>
        <div class="relative">
          <select
            value={activationType}
            onchange={(e) => setActivationType(e.currentTarget.value as ActivationType)}
            class="w-full py-1.5 px-3 border border-[#141414] bg-white text-[#141414]  text-[11px]  font-bold tracking-wider rounded-none appearance-none cursor-pointer focus:outline-none focus:bg-[#E4E3E0]"
          >
            <option value="sigmoid">sigmoid</option>
            <option value="tanh">tanh</option>
            <option value="relu">relu</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#141414]">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l2.908 2.915 2.908-2.915c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-3.415 3.42c-0.267 0.268-0.615 0.414-0.982 0.414s-0.715-0.146-0.982-0.414l-3.415-3.42c-0.408-0.418-0.436-1.17 0-1.615z"/>
            </svg>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
