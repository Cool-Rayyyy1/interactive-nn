<script lang="ts">
  import { cn } from '$lib/utils';
  import { NeuralNetworkModel } from '$lib/hooks/useNeuralNetwork.svelte';
  import type { ActivationType } from '$lib/types';
  import NetworkVisualization from '$lib/components/backpropagationPlay/NetworkVisualization.svelte';
  import TrainingControls from '$lib/components/backpropagationPlay/TrainingControls.svelte';
  import MathPanel from '$lib/components/backpropagationPlay/MathPanel.svelte';
  import ParameterTable from '$lib/components/backpropagationPlay/ParameterTable.svelte';
  import NotationLegend from '$lib/components/backpropagationPlay/NotationLegend.svelte';

  let learningRate = $state<number>(0.1);
  let target = $state<number>(0.5);
  let maxEpoch = $state<number>(10);
  let x1 = $state<number>(0.5);
  let x2 = $state<number>(0.8);
  let activationType = $state<ActivationType>('sigmoid');

  // Create reactive model instance directly using initial constants to avoid Svelte 5 compiler warning
  const model = new NeuralNetworkModel(0.1, 0.5, 10, 'sigmoid', 0.5, 0.8);

  // Sync state values to model config dynamically
  $effect(() => {
    model.updateConfig(learningRate, target, maxEpoch, activationType, x1, x2);
  });
</script>

<div class="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#F27D26]/20 p-4 md:p-6">
  <!-- Control bar -->
  <div class="max-w-7xl mx-auto mb-8 bg-white border border-[#141414] shadow-[3px_3px_0px_#141414] rounded-none font-sans overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between px-5 py-3 border-b border-[#141414] bg-[#E4E3E0]">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-[#F27D26]"></div>
          <h1 class="text-xs font-mono font-bold tracking-wider text-[#141414] uppercase">Engine Control & Sandbox</h1>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex flex-col items-end leading-none">
          <span class="text-[9px] text-[#141414]/60 uppercase font-mono tracking-wider font-bold">Epoch step</span>
          <span class="text-xl font-mono font-bold text-[#F27D26] tabular-nums mt-0.5">
            {String(model.epoch).padStart(4, '0')}
          </span>
        </div>
      </div>
    </div>

    <!-- Control area -->
    <div class="p-5 bg-white">
      <TrainingControls 
        isTraining={model.isTraining}
        setIsTraining={(val) => {
          if (val) model.startTrainingLoop();
          else model.stopTrainingLoop();
        }}
        reset={() => model.reset()}
        handlePrevStep={() => model.handlePrevStep()}
        handleStep={() => model.handleStep()}
        stepHistoryLen={model.stepHistory.length}
        step={model.step}
        subStep={model.subStep}
        learningRate={learningRate}
        setLearningRate={(val) => { learningRate = val; }}
        target={target}
        setTarget={(val) => { target = val; }}
        maxEpoch={maxEpoch}
        setMaxEpoch={(val) => { maxEpoch = val; }}
        activationType={activationType}
        setActivationType={(val) => { activationType = val; }}
        x1={x1}
        setX1={(val) => { x1 = val; }}
        x2={x2}
        setX2={(val) => { x2 = val; }}
      />
    </div>
  </div>

  <!-- main part -->
  <main class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- left -->
    <div class="lg:col-span-4 space-y-8">
      <div class="tech-card bg-white">
        <ParameterTable 
          weights={model.weights}
          biases={model.biases}
          activeElement={model.activeElement}
        />
      </div>

      <div class="tech-card bg-white">
        <NotationLegend activationType={activationType} />
      </div>
    </div>

    <!-- right -->
    <div class="lg:col-span-8 space-y-8">
      <!-- Visualization -->
      <div class="tech-card bg-white">
        <div class="tech-header flex justify-between items-center bg-[#E4E3E0] border-b border-[#141414] p-3">
          <div class="flex items-center gap-3">
            <div class={cn(
              "w-2.5 h-2.5 rounded-full border border-[#141414]",
              model.step === 'forward' ? 'bg-[#F27D26] animate-pulse' : 
              model.step === 'backward' ? 'bg-[#F27D26] animate-pulse' : 
              model.step === 'update' ? 'bg-[#F27D26] animate-pulse' : 
              'bg-white'
            )}></div>
            <span class="tech-label text-xs uppercase tracking-wider font-mono">
              {model.step === 'idle' ? 'System Idle' : `Current Phase: ${model.step} propagation`}
            </span>
          </div>

          <div class="tech-label text-xs font-mono uppercase tracking-wider">
            Sub-step: <span class="text-[#F27D26] font-bold">{model.subStep}</span>
          </div>
        </div>

        <div class="p-4 bg-white/40 border-t-0">
          <NetworkVisualization 
            weights={model.weights}
            biases={model.biases}
            neuronValues={model.neuronValues}
            activeElement={model.activeElement}
            step={model.step}
            target={target}
          />
        </div>
      </div>

      <!-- Educational Cards Section -->
      <div class="flex flex-col md:flex-row md:flex-nowrap w-full gap-0 border border-[#141414] shadow-[4px_4px_0px_#141414] bg-white overflow-hidden">
        <!-- Forward Pass Card -->
        <div class={cn(
          "transition-all duration-300 overflow-hidden flex flex-col border-b md:border-b-0 md:border-r border-[#141414]",
          model.step === 'forward' 
            ? 'md:flex-[8] flex-1 bg-white ring-1 ring-[#F27D26]/20' 
            : model.step === 'idle'
              ? 'md:flex-1 flex-1 bg-white'
              : 'md:flex-[0.45] flex-1 bg-[#E4E3E0]/40 opacity-70'
        )}>
          <div class={cn(
            "tech-header flex justify-between items-center bg-[#E4E3E0] border-b border-[#141414] p-3",
            model.step !== 'idle' && model.step !== 'forward' && "md:flex-col md:items-center md:py-8 md:px-1"
          )}>
            <span class={cn(
              "tech-label transition-transform duration-300 text-xs font-bold uppercase font-mono tracking-widest",
              model.step !== 'idle' && model.step !== 'forward' && "md:rotate-90 md:my-10 md:whitespace-nowrap md:origin-center"
            )}>
              Phase 01
            </span>
            <span class={cn(
              "font-bold text-[10px] md:text-xs uppercase tracking-widest font-mono truncate",
              model.step === 'forward' ? "text-[#F27D26]" : "text-[#141414]/60",
              model.step !== 'idle' && model.step !== 'forward' && "hidden"
            )}>
              Forward Pass & MSE
            </span>
          </div>

          <div class="p-0 overflow-visible flex-grow flex flex-col justify-center">
            {#if model.step === 'forward'}
              <div class="overflow-x-auto overflow-y-visible p-2">
                <MathPanel symbolicMath={model.symbolicMath} numericMath={model.numericMath} />
              </div>
            {:else}
              {#if model.step === 'idle'}
                <div class="min-h-[6rem] flex items-center justify-center bg-[#E4E3E0]/10 font-mono text-xs uppercase p-4">
                  <p class="text-[#141414]/50 italic text-center">
                    Awaiting forward...
                  </p>
                </div>
              {/if}
            {/if}
          </div>
        </div>

        <!-- Backward Pass Card -->
        <div class={cn(
          "transition-all duration-300 overflow-hidden flex flex-col border-b md:border-b-0 md:border-r border-[#141414]",
          model.step === 'backward' 
            ? 'md:flex-[8] flex-1 bg-white ring-1 ring-[#F27D26]/20' 
            : model.step === 'idle'
              ? 'md:flex-1 flex-1 bg-white'
              : 'md:flex-[0.45] flex-1 bg-[#E4E3E0]/40 opacity-70'
        )}>
          <div class={cn(
            "tech-header flex justify-between items-center bg-[#E4E3E0] border-b border-[#141414] p-3",
            model.step !== 'idle' && model.step !== 'backward' && "md:flex-col md:items-center md:py-8 md:px-1"
          )}>
            <span class={cn(
              "tech-label transition-transform duration-300 text-xs font-bold uppercase font-mono tracking-widest",
              model.step !== 'idle' && model.step !== 'backward' && "md:rotate-90 md:my-10 md:whitespace-nowrap md:origin-center"
            )}>
              Phase 02
            </span>
            <span class={cn(
              "font-bold text-[10px] md:text-xs uppercase tracking-widest font-mono truncate",
              model.step === 'backward' ? "text-[#F27D26]" : "text-[#141414]/60",
              model.step !== 'idle' && model.step !== 'backward' && "hidden"
            )}>
              The "Blame" Game
            </span>
          </div>

          <div class="p-0 overflow-visible flex-grow flex flex-col justify-center">
            {#if model.step === 'backward'}
              <div class="overflow-x-auto overflow-y-visible p-2">
                <MathPanel symbolicMath={model.symbolicMath} numericMath={model.numericMath} />
              </div>
            {:else}
              {#if model.step === 'idle'}
                <div class="min-h-[6rem] flex items-center justify-center bg-[#E4E3E0]/10 font-mono text-xs uppercase p-4">
                  <p class="text-[#141414]/50 italic text-center">
                    Awaiting backward...
                  </p>
                </div>
              {/if}
            {/if}
          </div>
        </div>

        <!-- Update Card -->
        <div class={cn(
          "transition-all duration-300 overflow-hidden flex flex-col",
          model.step === 'update' 
            ? 'md:flex-[8] flex-1 bg-white ring-1 ring-[#F27D26]/20' 
            : model.step === 'idle'
              ? 'md:flex-1 flex-1 bg-white'
              : 'md:flex-[0.45] flex-1 bg-[#E4E3E0]/40 opacity-70'
        )}>
          <div class={cn(
            "tech-header flex justify-between items-center bg-[#E4E3E0] border-b border-[#141414] p-3",
            model.step !== 'idle' && model.step !== 'update' && "md:flex-col md:items-center md:py-8 md:px-1"
          )}>
            <span class={cn(
              "tech-label transition-transform duration-300 text-xs font-bold uppercase font-mono tracking-widest",
              model.step !== 'idle' && model.step !== 'update' && "md:rotate-90 md:my-10 md:whitespace-nowrap md:origin-center"
            )}>
              Phase 03
            </span>
            <span class={cn(
              "font-bold text-[10px] md:text-xs uppercase tracking-widest font-mono truncate",
              model.step === 'update' ? "text-[#F27D26]" : "text-[#141414]/60",
              model.step !== 'idle' && model.step !== 'update' && "hidden"
            )}>
              Gradient Descent
            </span>
          </div>

          <div class="p-0 overflow-visible flex-grow flex flex-col justify-center">
            {#if model.step === 'update'}
              <div class="overflow-x-auto overflow-y-visible p-2">
                <MathPanel symbolicMath={model.symbolicMath} numericMath={model.numericMath} />
              </div>
            {:else}
              {#if model.step === 'idle'}
                <div class="min-h-[6rem] flex items-center justify-center bg-[#E4E3E0]/10 font-mono text-xs uppercase p-4">
                  <p class="text-[#141414]/50 italic text-center">
                    Awaiting updates...
                  </p>
                </div>
              {/if}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
