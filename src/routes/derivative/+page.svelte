<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { 
    Calculator, 
    FunctionSquare, 
    Info, 
    Minus, 
    Plus, 
    RefreshCcw, 
    Zap, 
    Target, 
    ArrowRight, 
    Play, 
    Square, 
    RotateCcw, 
    TrendingDown 
  } from 'lucide-svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  
  import MathPlot from "$lib/components/derivative/MathPlot.svelte"
  import { evaluateFunction, getDerivativeExpr, findLocalMinima } from "$lib/math/derivative-math";

  const PRESETS = [
    { name: 'Quadratic', expr: 'x^2', color: '#3b82f6', startX: -1.5, range: [-1.8, 1.8] as [number, number] },
    { name: 'Cubic', expr: '0.2x^3 - x', color: '#8b5cf6', startX: -2.5, range: [-3, 3] as [number, number] },
    { name: 'Cosine', expr: '2 * cos(x)', color: '#ec4899', startX: -1.5, range: [-4.5, 4.5] as [number, number] },
    { name: 'Valley', expr: '0.1x^4 - x^2 + 2', color: '#f59e0b', startX: -2.8, range: [-3.3, 3.3] as [number, number] },
  ];

  // State (Runes)
  let expression = $state(PRESETS[0].expr);
  let currentX = $state(PRESETS[0].startX);
  let h = $state(0.5);
  let learningRate = $state(0.1);
  let decayRate = $state(0.9);
  let useDecay = $state(false);
  let history = $state<{ x: number; y: number; iteration: number; loss: number }[]>([]);
  let iteration = $state(0);
  let isOptimizing = $state(false);

  // Derived values
  let activePreset = $derived(PRESETS.find(p => p.expr === expression) || PRESETS[0]);
  let derivativeExpr = $derived(getDerivativeExpr(expression));
  let xRange = $derived(activePreset.range);
  let localMinima = $derived(findLocalMinima(expression, xRange[0], xRange[1]));
  
  let targetY = $derived.by(() => {
    if (localMinima.length === 0) return 0;
    return Math.min(...localMinima.map(m => m.y));
  });

  let yAtX = $derived(evaluateFunction(expression, currentX));
  let yAtXh = $derived(evaluateFunction(expression, currentX + h));
  let secantSlope = $derived((yAtXh - yAtX) / h);

  let fPrimeX = $derived(evaluateFunction(getDerivativeExpr(expression), currentX));

  let currentLoss = $derived(Math.pow(yAtX - targetY, 2));
  let lossGradient = $derived(2 * (yAtX - targetY) * fPrimeX);

  let nextX = $derived(currentX - learningRate * lossGradient);

  function formatLatex(expr: string) {
    if (!expr) return '';
    return expr
      .replace(/x/g, '\\theta')
      .replace(/\*/g, ' \\cdot ')
      .replace(/sin/g, '\\sin')
      .replace(/cos/g, '\\cos')
      .replace(/tan/g, '\\tan')
      .replace(/e\^/g, 'e^{')
      .replace(/(\^)(\w+)/g, '^{$2}')
      .replace(/(\^)\(([^)]+)\)/g, '^{$2}');
  }

  let latexExpression = $derived(formatLatex(expression));
  let latexDerivative = $derived(formatLatex(derivativeExpr));

  function resetOptimization() {
    iteration = 0;
    history = [];
    isOptimizing = false;
  }

  function stepBack() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    history = history.slice(0, -1);
    currentX = last.x;
    iteration = last.iteration;
    isOptimizing = false;
  }

  function handlePreset(preset: typeof PRESETS[0]) {
    expression = preset.expr;
    currentX = preset.startX;
    resetOptimization();
  }

  function takeStep() {
    const stepX = nextX;
    const stepY = evaluateFunction(expression, stepX);
    
    history = [...history, { x: currentX, y: yAtX, iteration, loss: currentLoss }];
    currentX = stepX;
    iteration += 1;

    if (useDecay) {
      learningRate *= decayRate;
    }
    
    if (Math.abs(lossGradient) < 0.0001 || stepX < xRange[0] || stepX > xRange[1]) {
      isOptimizing = false;
    }
  }

  let timer: any;
  $effect(() => {
    if (isOptimizing) {
      timer = setInterval(takeStep, 200);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  });

  // Action for KatEx
  function latex(node: HTMLElement, options: { math: string, block?: boolean }) {
    function update(opts: { math: string, block?: boolean }) {
      katex.render(opts.math, node, { throwOnError: false, displayMode: opts.block });
    }
    update(options);
    return {
      update
    };
  }

  // Loss history data for simple SVG chart
  let lossHistoryData = $derived.by(() => {
    const data = history.map(h => h.loss);
    if (iteration > 0 || data.length === 0) {
      data.push(currentLoss);
    }
    return data;
  });

  let maxLossInHistory = $derived(Math.max(...lossHistoryData, 0.1));

</script>

<div class="flex flex-col h-screen bg-slate-100 font-sans text-slate-900 border-4 border-slate-300">
  <!-- Top Header -->
  <header class="h-14 bg-white border-b border-slate-300 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-indigo-200">
        <TrendingDown class="text-white w-4 h-4" />
      </div>
      <div>
        <h1 class="text-sm font-black text-slate-800 leading-none">Gradient Descent Lab</h1>
        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Derivative Playground</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      {#if Math.abs(lossGradient) < 0.001 && iteration > 0}
        <div class="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 animate-pulse">
          <Zap class="w-3 h-3 fill-current" />
          <span class="text-[10px] font-black uppercase">Converged</span>
        </div>
      {/if}
      <div class="flex items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400">Iter:</span>
          <span class="font-bold text-indigo-600">{iteration}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400">Loss:</span>
          <span class="font-bold text-rose-600">{isNaN(currentLoss) ? '—' : currentLoss.toFixed(4)}</span>
        </div>
      </div>
      <button 
         class="bg-slate-100 text-slate-800 border-2 border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
         onclick={resetOptimization}
      >
        <RotateCcw class="w-3 h-3" />
        Reset
      </button>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar Controls -->
    <aside class="w-80 bg-white border-r border-slate-300 p-5 flex flex-col gap-6 overflow-y-auto shrink-0">
      <section>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">1. Model Configuration</span>
        <div class="grid grid-cols-2 gap-2 mb-4">
          {#each PRESETS as p}
            <button
              onclick={() => handlePreset(p)}
              class="py-2 text-[10px] font-black rounded-lg border-2 transition-all {
                expression === p.expr 
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-500'
              }"
            >
              {p.name}
            </button>
          {/each}
        </div>

        <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <div class="flex justify-between items-center mb-1">
              <span class="text-[9px] font-bold text-amber-600 uppercase">Learning Rate (η)</span>
              <span class="text-[10px] font-black text-amber-700">{isNaN(learningRate) ? '—' : learningRate.toFixed(3)}</span>
            </div>
            <input 
              type="range" 
              min="0.001" 
              max="0.8" 
              step="0.001" 
              bind:value={learningRate}
              class="w-full accent-amber-500"
            />

            <div class="mt-3 space-y-2">
              <button 
                onclick={() => useDecay = !useDecay}
                class="w-full flex items-center justify-between p-2 rounded-lg border transition-all {
                  useDecay ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                }"
              >
                <span class="text-[9px] font-bold uppercase">Enable LR Decay</span>
                <div class="w-6 h-3 rounded-full relative transition-colors {useDecay ? 'bg-amber-500' : 'bg-slate-300'}">
                  <div class="absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all {useDecay ? 'right-0.5' : 'left-0.5'}"></div>
                </div>
              </button>

              {#if useDecay}
                <div class="space-y-1">
                  <div class="flex justify-between items-center">
                    <span class="text-[8px] font-bold text-amber-600 uppercase">Decay Rate (γ)</span>
                    <span class="text-[9px] font-black text-amber-700">{decayRate.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="0.99" 
                    step="0.01" 
                    bind:value={decayRate}
                    class="w-full accent-amber-400 h-1.5"
                  />
                </div>
              {/if}
            </div>
          </div>
      </section>

      <section>
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">2. Control Optimization</span>
        <div class="flex gap-2 mb-4">
          <button
            onclick={() => isOptimizing = !isOptimizing}
            class="flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 {
              isOptimizing ? 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600' : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
            }"
          >
            {#if isOptimizing}
              <Square class="w-4 h-4 fill-current" /> Stop
            {:else}
              <Play class="w-4 h-4 fill-current" /> Auto Step
            {/if}
          </button>
          
          <div class="flex flex-col gap-1">
            <button
              onclick={takeStep}
              disabled={isOptimizing}
              class="w-14 h-9 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 transition-colors relative group"
            >
              <ArrowRight class="w-5 h-5 text-slate-600" />
              <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Step Forward</span>
            </button>
            <button
              onclick={stepBack}
              disabled={isOptimizing || history.length === 0}
              class="w-14 h-9 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 transition-colors relative group"
            >
              <RotateCcw class="w-4 h-4 text-slate-600" />
              <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Step Back</span>
            </button>
          </div>
        </div>

        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex justify-between text-[9px] mb-2 font-bold text-slate-400 uppercase">
            <span>Parameter (θ) Value</span>
            <span class="text-slate-600 font-mono italic">{isNaN(currentX) ? '—' : currentX.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min={xRange[0]} 
            max={xRange[1]} 
            step="0.01" 
            bind:value={currentX}
            oninput={() => resetOptimization()}
            class="w-full accent-slate-600"
          />
        </div>
      </section>

      <section class="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">3. Notation Guide</span>
        <div class="space-y-3">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <span use:latex={{ math: '\\theta' }}></span>
            </div>
            <div>
              <div class="text-[10px] font-bold text-slate-700">Parameter</div>
              <div class="text-[9px] text-slate-500 leading-tight">The variable we optimize to minimize loss.</div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
              <span use:latex={{ math: 'L' }}></span>
            </div>
            <div>
              <div class="text-[10px] font-bold text-slate-700">Loss Function</div>
              <div class="text-[9px] text-slate-500 leading-tight">Quantifies the error from the target.</div>
            </div>
          </div>

          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <span use:latex={{ math: '\\eta' }}></span>
            </div>
            <div>
              <div class="text-[10px] font-bold text-slate-700">Learning Rate</div>
              <div class="text-[9px] text-slate-500 leading-tight">Step size factor for update.</div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 flex-shrink-0">
              <span use:latex={{ math: 'dL' }}></span>
            </div>
            <div>
              <!-- <div class="text-[10px] font-bold text-slate-700">dL</div> -->
              <div class="text-[9px] text-slate-500 leading-tight">Change in loss.</div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <span use:latex={{ math: 'd\\theta' }}></span>
            </div>
            <div>
              <!-- <div class="text-[10px] font-bold text-slate-700">d\theta</div> -->
              <div class="text-[9px] text-slate-500 leading-tight">Change in parameter (θ).</div>
            </div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
              <span use:latex={{ math: '\\frac{dL}{d\\theta}' }}></span>
            </div>
            <div>
              <!-- <div class="text-[10px] font-bold text-slate-700">dL/d\theta</div> -->
              <div class="text-[9px] text-slate-500 leading-tight">Rate of change of loss with respect to the parameter.</div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-auto">
        <div class="h-32 w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden relative p-1">
          <div class="absolute top-1 left-2 text-[8px] font-black text-slate-400 uppercase z-10">Loss History</div>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d={lossHistoryData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / Math.max(1, lossHistoryData.length - 1)) * 100} ${100 - (v / maxLossInHistory) * 80 - 10}`).join(' ')}
              fill="none" 
              stroke="#ef4444" 
              stroke-width="2" 
              vector-effect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </aside>

    <!-- Graph Content Area -->
    <main class="flex-1 p-6 flex flex-col min-w-0 bg-slate-100 gap-6">
      <div class="flex-1 bg-white rounded-[2rem] border-2 border-slate-200 shadow-sm overflow-hidden relative">
        <div class="absolute inset-4 rounded-[1.5rem] overflow-hidden">
           <MathPlot 
            {expression}
            {xRange}
            yRange={[-3.5, 3.5]}
            {currentX}
            {h}
            {history}
            {targetY}
            gradient={lossGradient}
            {learningRate}
            minima={localMinima}
            width={800}
            height={500}
          />
        </div>
      </div>

      <!-- New Optimization Panel -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <!-- The Update Tool -->
        <div class="bg-slate-800 text-white p-4 rounded-2xl shadow-lg shadow-slate-200 flex flex-col justify-between group overflow-hidden">
          <div class="flex items-center gap-2 mb-2">
            <Zap class="w-3 h-3 text-amber-400 fill-current" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Update Rule</h4>
          </div>
          <div class="space-y-2">
            <div class="text-xs text-slate-400 font-mono text-center mb-1 scale-110">
              <span use:latex={{ math: '\\theta_{next} = \\theta - \\eta \\cdot \\frac{dL}{d\\theta}' }}></span>
            </div>
            <div class="bg-slate-700/50 p-2 rounded-xl border border-slate-700 group-hover:border-amber-400/30 transition-colors">
              <div class="text-[10px] font-mono text-center text-amber-100/80 scale-110">
                <span use:latex={{ math: `${isNaN(currentX) ? '\\text{NaN}' : currentX.toFixed(2)} - ${isNaN(learningRate) ? '\\text{NaN}' : learningRate.toFixed(2)} \\cdot ${isNaN(lossGradient) ? '\\text{NaN}' : lossGradient.toFixed(2)}` }}></span>
              </div>
              <div class="text-center mt-1 pt-1 border-t border-slate-600/50">
                <span class="text-xl font-black text-amber-400 font-mono tracking-tighter">
                  {isNaN(nextX) ? '—' : nextX.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loss Detail -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div class="flex items-center gap-2 mb-2">
            <Target class="w-3 h-3 text-rose-500" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Objective (Loss)</h4>
          </div>
          <div class="space-y-2">
            <div class="text-xs text-slate-400 font-mono text-center scale-110">
              <span use:latex={{ math: 'L = (f(\\theta) - \\text{target})^2' }}></span>
            </div>
            <div class="bg-rose-50/50 p-2 rounded-xl border border-rose-100 italic">
              <div class="text-[10px] font-mono text-center text-rose-400 scale-110">
                <span use:latex={{ math: `(${isNaN(yAtX) ? '\\text{NaN}' : yAtX.toFixed(2)} - ${isNaN(targetY) ? '\\text{NaN}' : targetY.toFixed(1)})^2` }}></span>
              </div>
              <div class="text-center mt-1 pt-1 border-t border-rose-100">
                <span class="text-xl font-black text-slate-800 font-mono tracking-tighter">
                  {isNaN(currentLoss) ? '—' : currentLoss.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gradient Detail -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div class="flex items-center gap-2 mb-2">
            <RefreshCcw class="w-3 h-3 text-emerald-500" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Gradient (Slope)</h4>
          </div>
          <div class="space-y-2 text-center">
            <div class="text-xs text-slate-400 font-mono scale-110">
              <span use:latex={{ math: '\\frac{dL}{d\\theta} = 2(f(\\theta) - \\text{target}) \\cdot f\'(\\theta)' }}></span>
            </div>
            <div class="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
              <div class="text-[9px] font-mono text-emerald-400 scale-110">
                <span use:latex={{ math: `2 \\cdot (${isNaN(yAtX) ? '\\text{NaN}' : yAtX.toFixed(2)} - ${isNaN(targetY) ? '\\text{NaN}' : targetY.toFixed(1)}) \\cdot ${isNaN(fPrimeX) ? '\\text{NaN}' : fPrimeX.toFixed(2)}` }}></span>
              </div>
              <div class="text-xl font-black text-slate-800 font-mono tracking-tighter mt-1 pt-1 border-t border-emerald-100">
                {isNaN(lossGradient) ? '—' : lossGradient.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        <!-- Model Output -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div class="flex items-center gap-2 mb-2">
            <FunctionSquare class="w-3 h-3 text-indigo-500" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Model Output</h4>
          </div>
          <div class="space-y-2">
            <div class="text-xs text-slate-400 font-mono text-center truncate scale-110">
              <span use:latex={{ math: `f(\\theta) = ${latexExpression}` }}></span>
            </div>
            <div class="bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 text-center">
              <div class="text-[10px] font-mono text-indigo-400 scale-110">
                <span use:latex={{ math: `f(${isNaN(currentX) ? '\\text{NaN}' : currentX.toFixed(2)})` }}></span>
              </div>
              <div class="text-xl font-black text-indigo-600 font-mono tracking-tighter mt-1 pt-1 border-t border-indigo-100">
                {isNaN(yAtX) ? '—' : yAtX.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</div>

<style>
  :global(.katex-display) {
    margin: 0;
  }
</style>
