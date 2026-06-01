<script lang="ts">
  import { Calculator, FunctionSquare, Info, Minus, Plus, RefreshCw, Zap, ArrowRight, Play, Square, RotateCcw, TrendingDown } from 'lucide-svelte';
  import katex from 'katex';
  import 'katex/dist/katex.min.css';
  import MathPlot from '$lib/components/derivative/MathPlot.svelte';
  import { evaluateFunction, getDerivativeExpr, findLocalMinima } from '$lib/math/derivative-math';

  const PRESETS = [
    { name: 'Quadratic', expr: 'x^2', color: '#3b82f6', startX: -1.5, range: [-1.8, 1.8] as [number, number] },
    { name: 'Cubic', expr: '0.2x^3 - x', color: '#8b5cf6', startX: -2.5, range: [-3, 3] as [number, number] },
    { name: 'Cosine', expr: '2 * cos(x)', color: '#ec4899', startX: -1.5, range: [-4.5, 4.5] as [number, number] },
    { name: 'Valley', expr: '0.1x^4 - x^2 + 2', color: '#f59e0b', startX: -2.8, range: [-3.3, 3.3] as [number, number] },
  ];

  // Helper inside Svelte to render KaTeX securely
  function renderMath(math: string, displayMode = false) {
    try {
      return katex.renderToString(math, { displayMode, throwOnError: false });
    } catch (e) {
      return math;
    }
  }

  // State
  let expression = $state(PRESETS[0].expr);
  let currentX = $state(PRESETS[0].startX);
  let h = $state(0.5);
  let learningRate = $state(0.1);
  let decayRate = $state(0.9);
  let useDecay = $state(false);
  let history = $state<{ x: number; y: number; iteration: number; loss: number }[]>([]);
  let iteration = $state(0);
  let isOptimizing = $state(false);

  // Derived Values
  let activePreset = $derived(
    PRESETS.find(p => p.expr === expression) || PRESETS[0]
  );

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

  let currentLoss = $derived(yAtX);
  let lossGradient = $derived(fPrimeX);

  let nextX = $derived(currentX - learningRate * lossGradient);

  // Standard substitutions for Parameter (θ) representations in LaTeX
  let latexExpression = $derived.by(() => {
    return expression
      .replace(/x/g, '\\theta')
      .replace(/\*/g, ' \\cdot ')
      .replace(/sin/g, '\\sin')
      .replace(/cos/g, '\\cos')
      .replace(/tan/g, '\\tan')
      .replace(/e\^/g, 'e^{')
      .replace(/(\^)(\w+)/g, '^{$2}')
      .replace(/(\^)\(([^)]+)\)/g, '^{$2}');
  });

  let latexDerivative = $derived.by(() => {
    if (!derivativeExpr) return '';
    return derivativeExpr
      .replace(/x/g, '\\theta')
      .replace(/\*/g, ' \\cdot ')
      .replace(/sin/g, '\\sin')
      .replace(/cos/g, '\\cos')
      .replace(/tan/g, '\\tan')
      .replace(/e\^/g, 'e^{')
      .replace(/(\^)(\w+)/g, '^{$2}')
      .replace(/(\^)\(([^)]+)\)/g, '^{$2}');
  });

  // Actions
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
    const stepLoss = stepY;
    
    // Save previous state to history
    history = [...history, { x: currentX, y: yAtX, iteration, loss: currentLoss }];
    currentX = stepX;
    iteration += 1;

    if (useDecay) {
      learningRate = learningRate * decayRate;
    }
    
    // Stop if converged or out of bounds
    if (Math.abs(lossGradient) < 0.0001 || stepX < xRange[0] || stepX > xRange[1]) {
      isOptimizing = false;
    }
  }

  // Interval timer for Svelte Auto Stepping
  $effect(() => {
    let timer: any;
    if (isOptimizing) {
      timer = setInterval(takeStep, 200);
    }
    return () => clearInterval(timer);
  });

  // Calculate coordinates for historical line graph
  let lossHistoryData = $derived.by(() => {
    const data = history.map(h => ({ name: h.iteration, loss: h.loss }));
    if (iteration > 0 || data.length === 0) {
      data.push({ name: iteration, loss: currentLoss });
    }
    return data;
  });

  let historyPoints = $derived.by(() => {
    if (lossHistoryData.length === 0) return '';
    const losses = lossHistoryData.map(d => d.loss);
    const minLoss = Math.min(...losses);
    const maxLoss = Math.max(...losses);
    const lossRange = Math.max(0.001, maxLoss - minLoss);

    const chartW = 270;
    const chartH = 80;

    return lossHistoryData.map((d, i) => {
      const x = lossHistoryData.length > 1 ? (i / (lossHistoryData.length - 1)) * chartW : chartW / 2;
      const y = chartH - ((d.loss - minLoss) / lossRange) * (chartH - 20) - 10;
      return `${x},${y}`;
    }).join(' ');
  });
</script>

<div class="flex flex-col h-screen bg-brut-bg font-sans text-brut-ink border-2 border-brut-ink select-none overflow-hidden">
  <!-- Top Header -->
  <header class="h-14 bg-white border-b-2 border-brut-ink flex items-center justify-between px-6 z-10 shrink-0 select-none">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-brut-ink flex items-center justify-center border border-brut-ink">
        <TrendingDown class="text-white w-4 h-4" />
      </div>
      <div>
        <h1 class="text-lg font-serif font-black text-brut-ink leading-none">
          Gradient Descent <span class="font-serif italic font-normal text-brut-orange">lab</span>
        </h1>
        <p class="text-[9px] text-[#141414]/60 font-mono uppercase tracking-widest mt-0.5">Optimization Sandbox</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      {#if Math.abs(lossGradient) < 0.001 && iteration > 0}
        <div class="flex items-center gap-1.5 bg-brut-orange text-white px-2.5 py-1 border border-brut-ink font-mono text-[9px] uppercase tracking-wider font-bold shadow-[1px_1px_0px_#141414]">
          <Zap class="w-3 h-3 fill-current" />
          <span>Converged</span>
        </div>
      {/if}
      <div class="flex items-center gap-4 text-xs font-mono">
        <div class="flex items-center gap-1.5 bg-white border border-brut-ink px-2 py-0.5">
          <span class="text-brut-ink/55 uppercase text-[9px]">Iter:</span>
          <span class="font-bold text-brut-ink">{iteration}</span>
        </div>
        <div class="flex items-center gap-1.5 bg-white border border-brut-ink px-2 py-0.5">
          <span class="text-brut-ink/55 uppercase text-[9px]">Loss L(θ):</span>
          <span class="font-bold text-brut-orange">{isNaN(currentLoss) ? '—' : currentLoss.toFixed(4)}</span>
        </div>
      </div>
      <button 
         class="bg-white hover:bg-brut-orange hover:text-white hover:border-[#141414] text-brut-ink border-2 border-brut-ink shadow-[2px_2px_0px_#141414] hover:shadow-[3px_3px_0px_#141414] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#141414] px-3 py-1 text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer"
         onclick={resetOptimization}
      >
        <RotateCcw class="w-3 h-3" />
        Reset
      </button>
    </div>
  </header>

  <div class="flex flex-1 overflow-hidden">
    <!-- Sidebar Controls -->
    <aside class="w-80 bg-brut-bg border-r-2 border-brut-ink p-5 flex flex-col gap-5 overflow-y-auto shrink-0 antialiased">
      
      <section class="bg-white border-2 border-brut-ink p-4 shadow-[3px_3px_0px_#141414] flex flex-col gap-3">
        <label class="text-[9px] font-mono font-black text-brut-ink uppercase tracking-wider">1. Model Configuration</label>
        <div class="grid grid-cols-2 gap-1.5">
          {#each PRESETS as p (p.name)}
            <button
              onclick={() => handlePreset(p)}
              class="py-2 text-[10px] font-mono font-bold border-2 border-brut-ink transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#141414] hover:shadow-[2.5px_2.5px_0px_#141414] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#141414] {
                expression === p.expr 
                  ? 'bg-brut-ink text-white' 
                  : 'bg-white text-brut-ink hover:bg-brut-orange hover:text-white'
              }"
            >
              {p.name}
            </button>
          {/each}
        </div>

        <div class="p-2 bg-brut-bg/30 border border-dashed border-brut-ink/20 mt-1">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[9px] font-mono font-black text-brut-ink uppercase tracking-wider">Learning Rate (η)</span>
            <span class="text-[10px] font-mono font-bold text-brut-orange">{isNaN(learningRate) ? '—' : learningRate.toFixed(3)}</span>
          </div>
          <input 
            type="range" 
            min="0.001" 
            max="0.8" 
            step="0.001" 
            bind:value={learningRate}
            class="w-full cursor-col-resize"
          />

          <div class="mt-2 pt-2 border-t border-dashed border-brut-ink/15">
            <button 
              onclick={() => useDecay = !useDecay}
              class="w-full flex items-center justify-between p-1.5 border-2 border-brut-ink transition-all font-mono cursor-pointer shadow-[1.5px_1.5px_0px_#141414] hover:shadow-[2.5px_2.5px_0px_#141414] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#141414] {
                useDecay ? 'bg-brut-ink text-white hover:bg-brut-orange hover:text-white' : 'bg-white text-brut-ink hover:bg-brut-ink hover:text-white'
              }"
            >
              <span class="text-[8px] uppercase tracking-wider font-bold">LR Decay (γ)</span>
              <div class="w-5 h-2.5 bg-white border border-brut-ink relative transition-colors">
                <div class="absolute top-0.5 w-1.5 h-1.5 bg-brut-orange transition-all {useDecay ? 'right-0.5' : 'left-0.5'}" />
              </div>
            </button>

            {#if useDecay}
              <div class="space-y-1 mt-2">
                <div class="flex justify-between items-center text-[8px] font-mono text-brut-ink/70">
                  <span>Decay Factor</span>
                  <span>{decayRate.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="0.99" 
                  step="0.01" 
                  bind:value={decayRate}
                  class="w-full cursor-col-resize"
                />
              </div>
            {/if}
          </div>
        </div>
      </section>

      <section class="bg-white border-2 border-brut-ink p-4 shadow-[3px_3px_0px_#141414] flex flex-col gap-3">
        <label class="text-[9px] font-mono font-black text-brut-ink uppercase tracking-wider">2. Control Optimization</label>
        <div class="flex gap-1.5">
          <button
            onclick={() => isOptimizing = !isOptimizing}
            class="flex-1 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider transition-all border-2 border-brut-ink cursor-pointer flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#141414] hover:shadow-[3.5px_3.5px_0px_#141414] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#141414] {
              isOptimizing 
                ? 'bg-brut-orange text-white hover:bg-red-500 hover:border-[#141414]' 
                : 'bg-white text-brut-ink hover:bg-brut-orange hover:text-white'
            }"
          >
            {#if isOptimizing}
              <Square class="w-3.5 h-3.5 fill-current" /> Stop
            {:else}
              <Play class="w-3.5 h-3.5 fill-current" /> Auto Step
            {/if}
          </button>
          
          <button
            onclick={takeStep}
            disabled={isOptimizing}
            class="w-12 h-9 bg-white border-2 border-brut-ink shadow-[2px_2px_0px_#141414] hover:shadow-[3.5px_3.5px_0px_#141414] flex items-center justify-center hover:bg-brut-orange hover:text-white active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#141414] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Step Forward"
          >
            <ArrowRight class="w-4 h-4" />
          </button>
          
          <button
            onclick={stepBack}
            disabled={isOptimizing || history.length === 0}
            class="w-12 h-9 bg-white border-2 border-brut-ink shadow-[2px_2px_0px_#141414] hover:shadow-[3.5px_3.5px_0px_#141414] flex items-center justify-center hover:bg-brut-ink hover:text-white active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[1px_1px_0px_#141414] disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Step Back"
          >
            <RotateCcw class="w-3.5 h-3.5" />
          </button>
        </div>

        <div class="p-2.5 bg-brut-bg/30 border border-dashed border-brut-ink/20 mt-1">
          <div class="flex justify-between text-[9px] font-mono font-black uppercase mb-1">
            <span>Value of θ</span>
            <span class="text-brut-orange italic font-bold">{isNaN(currentX) ? '—' : currentX.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min={xRange[0]} 
            max={xRange[1]} 
            step="0.01" 
            bind:value={currentX}
            oninput={resetOptimization}
            class="w-full cursor-col-resize"
          />
        </div>
      </section>

      <section class="bg-white border-2 border-brut-ink p-4 shadow-[3px_3px_0px_#141414] flex flex-col gap-2">
        <label class="text-[9px] font-mono font-black text-brut-ink uppercase tracking-wider">3. Notation Guide</label>
        <div class="space-y-2 font-mono text-[9px]">
          <div class="flex items-center gap-2 pb-1.5 border-b border-brut-ink/10">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("\\theta")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">Parameter (θ)</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Variable optimized directly.</div>
            </div>
          </div>
          <div class="flex items-center gap-2 pb-1.5 border-b border-brut-ink/10">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("L")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">Loss Function (L)</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Strict objective function L(θ).</div>
            </div>
          </div>
          <div class="flex items-center gap-2 pb-1.5 border-b border-brut-ink/10">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("\\eta")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">Learning Rate (η)</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Step size scaling factor.</div>
            </div>
          </div>
          <div class="flex items-center gap-2 pb-1.5 border-b border-brut-ink/10">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("dL")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">dL</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Infinitessimal change in loss.</div>
            </div>
          </div>
          <div class="flex items-center gap-2 pb-1.5 border-b border-brut-ink/10">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("d\\theta")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">dθ</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Infinitessimal change in parameter.</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 border border-brut-ink bg-brut-bg flex items-center justify-center font-bold text-[10px] text-brut-ink flex-shrink-0">
              {@html renderMath("\\frac{dL}{d\\theta}")}
            </div>
            <div>
              <div class="font-bold text-[#141414]">dL/dθ</div>
              <div class="text-[8px] text-[#141414]/65 leading-tight">Rate of change of loss with respect to θ (slope).</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SVG Mini history line graph -->
      <div class="mt-auto">
        <div class="h-28 w-full bg-white border-2 border-brut-ink p-2 shadow-[2px_2px_0px_#141414] relative overflow-hidden flex flex-col justify-between">
          <div class="text-[8px] font-mono font-black text-brut-ink uppercase z-10">L(θ) History</div>
          <div class="w-full h-16 relative overflow-visible mt-2">
            {#if lossHistoryData.length > 0}
              <svg width="100%" height="100%" viewBox="0 0 270 80" class="overflow-visible" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="270" y2="10" stroke="#141414" stroke-opacity="0.1" stroke-dasharray="2 2" />
                <line x1="0" y1="45" x2="270" y2="45" stroke="#141414" stroke-opacity="0.1" stroke-dasharray="2 2" />
                <line x1="0" y1="75" x2="270" y2="75" stroke="#141414" stroke-opacity="0.1" stroke-dasharray="2 2" />
                <polyline
                  fill="none"
                  stroke="#F27D26"
                  stroke-width="2.5"
                  points={historyPoints}
                />
              </svg>
            {:else}
              <div class="w-full h-full flex items-center justify-center text-[8px] font-mono font-bold text-brut-ink/40">
                NO HISTORY
              </div>
            {/if}
          </div>
        </div>
      </div>
    </aside>

    <!-- Graph Content Area -->
    <main class="flex-1 p-6 flex flex-col min-w-0 bg-brut-bg gap-6 overflow-y-auto">
      <div class="flex-1 min-h-[400px] bg-white border-2 border-brut-ink shadow-[5px_5px_0px_#141414] overflow-hidden relative">
        <!-- Elegant Header Decal -->
        <div class="absolute top-4 left-4 z-10 bg-white border border-[#141414] px-3 py-1 text-[9px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-[1.5px_1.5px_0px_#141414]">
          <span class="w-1.5 h-1.5 bg-brut-orange animate-pulse" />
          <span>Loss Surface Projection: L(θ)</span>
        </div>
        
        <div class="absolute inset-0">
           <MathPlot 
            expression={expression}
            xRange={xRange}
            yRange={[-3.5, 3.5]}
            currentX={currentX}
            h={h}
            history={history}
            targetY={targetY}
            gradient={lossGradient}
            learningRate={learningRate}
            minima={localMinima}
            width={800}
            height={500}
          />
        </div>
      </div>

      <!-- Optimization Metrics Panel -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 font-mono text-brut-ink">
        <!-- The Update Tool -->
        <div class="bg-white border-2 border-brut-ink p-4 shadow-[4px_4px_0px_#141414] flex flex-col justify-between group overflow-hidden">
          <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-dashed border-brut-ink/15">
            <Zap class="w-3 h-3 text-brut-orange" />
            <h4 class="text-[9px] font-black uppercase tracking-wider">Update Rule</h4>
          </div>
          <div class="space-y-2">
            <div class="text-xs text-brut-ink font-bold text-center scale-105">
              {@html renderMath("\\theta_{next} = \\theta - \\eta \\cdot \\frac{dL}{d\\theta}")}
            </div>
            <div class="bg-brut-bg/40 border border-dashed border-brut-ink/20 p-2 text-center">
              <div class="text-[10px] font-semibold text-brut-ink/80 scale-105">
                {@html renderMath(`${isNaN(currentX) ? '\\text{NaN}' : currentX.toFixed(2)} - ${isNaN(learningRate) ? '\\text{NaN}' : learningRate.toFixed(2)} \\cdot ${isNaN(lossGradient) ? '\\text{NaN}' : lossGradient.toFixed(2)}`)}
              </div>
              <div class="text-center mt-1 pt-1 border-t border-brut-ink/15">
                <span class="text-xl font-black text-brut-orange font-mono tracking-tighter">
                  {isNaN(nextX) ? '—' : nextX.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gradient Detail -->
        <div class="bg-white border-2 border-brut-ink p-4 shadow-[4px_4px_0px_#141414] flex flex-col justify-between overflow-hidden">
          <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-dashed border-brut-ink/15">
            <RefreshCw class="w-3 h-3 text-brut-ink" />
            <h4 class="text-[9px] font-black uppercase tracking-wider">Gradient (Slope)</h4>
          </div>
          <div class="space-y-2 text-center">
            <div class="text-xs text-brut-ink font-bold scale-105">
              {@html renderMath(`\\frac{dL}{d\\theta} = L'(\\theta) = ${latexDerivative}`)}
            </div>
            <div class="bg-brut-bg/40 border border-dashed border-brut-ink/20 p-2 text-center">
              <div class="text-[9px] text-[#141414] scale-105">
                {@html renderMath(`L'(${isNaN(currentX) ? '\\text{NaN}' : currentX.toFixed(2)})`)}
              </div>
              <div class="text-xl font-black text-brut-ink font-mono tracking-tighter mt-1 pt-1 border-t border-brut-ink/15">
                {isNaN(lossGradient) ? '—' : lossGradient.toFixed(4)}
              </div>
            </div>
          </div>
        </div>

        <!-- Loss Function -->
        <div class="bg-white border-2 border-brut-ink p-4 shadow-[4px_4px_0px_#141414] flex flex-col justify-between overflow-hidden">
          <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-dashed border-brut-ink/15">
            <FunctionSquare class="w-3 h-3 text-brut-ink" />
            <h4 class="text-[9px] font-black uppercase tracking-wider">Loss Function</h4>
          </div>
          <div class="space-y-2">
            <div class="text-xs text-brut-ink font-bold text-center truncate scale-105">
              {@html renderMath(`L(\\theta) = ${latexExpression}`)}
            </div>
            <div class="bg-brut-bg/40 border border-dashed border-brut-ink/20 p-2 text-center">
              <div class="text-[9px] text-brut-ink/80 scale-105">
                {@html renderMath(`L(${isNaN(currentX) ? '\\text{NaN}' : currentX.toFixed(2)})`)}
              </div>
              <div class="text-xl font-black text-brut-ink font-mono tracking-tighter mt-1 pt-1 border-t border-brut-ink/15">
                {isNaN(yAtX) ? '—' : yAtX.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</div>
