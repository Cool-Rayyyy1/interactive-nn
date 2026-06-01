```svelte
<script lang="ts">
  import { fade } from 'svelte/transition';

  import {
    FunctionSquare,
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

  import MathPlot from "$lib/components/derivative/MathPlot.svelte";

  import {
    evaluateFunction,
    getDerivativeExpr,
    findLocalMinima
  } from "$lib/math/derivative-math";

  const PRESETS = [
    {
      name: 'Quadratic',
      expr: 'x^2',
      color: '#F27D26',
      startX: -1.5,
      range: [-1.8, 1.8] as [number, number]
    },

    {
      name: 'Cubic',
      expr: '0.2x^3 - x',
      color: '#F27D26',
      startX: -2.5,
      range: [-3, 3] as [number, number]
    },

    {
      name: 'Cosine',
      expr: '2 * cos(x)',
      color: '#F27D26',
      startX: -1.5,
      range: [-4.5, 4.5] as [number, number]
    },

    {
      name: 'Valley',
      expr: '0.1x^4 - x^2 + 2',
      color: '#F27D26',
      startX: -2.8,
      range: [-3.3, 3.3] as [number, number]
    },
  ];

  let expression = $state(PRESETS[0].expr);

  let currentX = $state(PRESETS[0].startX);

  let h = $state(0.5);

  let learningRate = $state(0.1);

  let decayRate = $state(0.9);

  let useDecay = $state(false);

  let history = $state<
    {
      x: number;
      y: number;
      iteration: number;
      loss: number;
    }[]
  >([]);

  let iteration = $state(0);

  let isOptimizing = $state(false);

  let activePreset = $derived(
    PRESETS.find(p => p.expr === expression) || PRESETS[0]
  );

  let derivativeExpr = $derived(
    getDerivativeExpr(expression)
  );

  let xRange = $derived(activePreset.range);

  let localMinima = $derived(
    findLocalMinima(expression, xRange[0], xRange[1])
  );

  let targetY = $derived.by(() => {
    if (localMinima.length === 0) return 0;

    return Math.min(...localMinima.map(m => m.y));
  });

  let yAtX = $derived(
    evaluateFunction(expression, currentX)
  );

  let fPrimeX = $derived(
    evaluateFunction(
      getDerivativeExpr(expression),
      currentX
    )
  );

  let currentLoss = $derived(
    Math.pow(yAtX - targetY, 2)
  );

  let lossGradient = $derived(
    2 * (yAtX - targetY) * fPrimeX
  );

  let nextX = $derived(
    currentX - learningRate * lossGradient
  );

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

    history = [
      ...history,
      {
        x: currentX,
        y: yAtX,
        iteration,
        loss: currentLoss
      }
    ];

    currentX = stepX;

    iteration += 1;

    if (useDecay) {
      learningRate *= decayRate;
    }

    if (
      Math.abs(lossGradient) < 0.0001 ||
      stepX < xRange[0] ||
      stepX > xRange[1]
    ) {
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

  function latex(
    node: HTMLElement,
    options: {
      math: string;
      block?: boolean;
    }
  ) {
    function update(
      opts: {
        math: string;
        block?: boolean;
      }
    ) {
      katex.render(
        opts.math,
        node,
        {
          throwOnError: false,
          displayMode: opts.block
        }
      );
    }

    update(options);

    return {
      update
    };
  }
</script>

<div
  class="
    flex
    flex-col
    h-screen
    bg-[#E4E3E0]
    text-[#141414]
  "
>

  <!-- HEADER -->
  <header
    class="
      h-16
      px-8
      bg-[#FFFFFF]
      border-b
      border-[#141414]
      flex
      items-center
      justify-between
      shrink-0
    "
  >

    <div class="flex items-center gap-4">

      <div
        class="
          w-10
          h-10
          bg-[#F27D26]
          border
          border-[#141414]
          shadow-[2px_2px_0px_#141414]
          flex
          items-center
          justify-center
        "
      >
        <TrendingDown class="w-4 h-4 text-[#141414]" />
      </div>

      <div>
        <h1
          class="
            font-serif
            text-3xl
            leading-none
          "
        >
          Gradient Descent Lab
        </h1>

        <p
          class="
            italic
            text-xs
            opacity-60
            mt-1
          "
        >
          derivative playground
        </p>
      </div>

    </div>

    <div
      class="
        flex
        items-center
        gap-6
        font-mono
        uppercase
        tracking-wide
        text-xs
      "
    >

      <div class="flex items-center gap-2">
        <span class="opacity-50">iter</span>
        <span>{iteration}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="opacity-50">loss</span>

        <span>
          {isNaN(currentLoss)
            ? '—'
            : currentLoss.toFixed(4)}
        </span>
      </div>

      <button
        onclick={resetOptimization}
        class="
          border
          border-[#141414]
          bg-[#FFFFFF]
          px-4
          py-2
          shadow-[2px_2px_0px_#141414]
          hover:bg-[#141414]
          hover:text-[#E4E3E0]
          active:translate-x-[2px]
          active:translate-y-[2px]
          active:shadow-none
          transition-all
          duration-75
        "
      >
        Reset
      </button>

    </div>

  </header>

  <div class="flex flex-1 overflow-hidden">

    <!-- SIDEBAR -->
    <aside
      class="
        w-80
        shrink-0
        overflow-y-auto
        border-r
        border-[#141414]
        p-6
        flex
        flex-col
        gap-8
      "
    >

      <!-- PRESETS -->
      <section class="space-y-4">

        <div>
          <h2 class="font-serif text-2xl">
            Configuration
          </h2>

          <p class="italic text-xs opacity-60">
            function presets
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3">

          {#each PRESETS as p}

            <button
              onclick={() => handlePreset(p)}
              class="
                border
                border-[#141414]
                px-3
                py-3
                bg-[#FFFFFF]
                font-mono
                uppercase
                tracking-wide
                text-xs
                shadow-[2px_2px_0px_#141414]
                active:translate-x-[2px]
                active:translate-y-[2px]
                active:shadow-none
                transition-all
                duration-75
                {
                  expression === p.expr
                    ? 'bg-[#141414] text-[#E4E3E0]'
                    : 'hover:bg-[#F27D26]'
                }
              "
            >
              {p.name}
            </button>

          {/each}

        </div>

      </section>

      <!-- LEARNING RATE -->
      <section
        class="
          bg-[#FFFFFF]
          border
          border-[#141414]
          p-5
          shadow-[2px_2px_0px_#141414]
          space-y-4
        "
      >

        <div>
          <h2 class="font-serif text-xl">
            Learning Rate
          </h2>

          <p class="italic text-xs opacity-60">
            optimization scale
          </p>
        </div>

        <div
          class="
            flex
            justify-between
            font-mono
            uppercase
            tracking-wide
            text-xs
          "
        >
          <span>η</span>
          <span>{learningRate.toFixed(3)}</span>
        </div>

        <input
          type="range"
          min="0.001"
          max="0.8"
          step="0.001"
          bind:value={learningRate}
          class="neo-slider w-full"
        />

      </section>

      <!-- CONTROLS -->
      <section class="space-y-4">

        <div>
          <h2 class="font-serif text-2xl">
            Optimization
          </h2>

          <p class="italic text-xs opacity-60">
            step controls
          </p>
        </div>

        <div class="flex gap-3">

          <button
            onclick={() => isOptimizing = !isOptimizing}
            class="
              flex-1
              border
              border-[#141414]
              bg-[#141414]
              text-[#E4E3E0]
              py-4
              font-mono
              uppercase
              tracking-wide
              text-xs
              shadow-[2px_2px_0px_#141414]
              hover:bg-[#F27D26]
              hover:text-[#141414]
              active:translate-x-[2px]
              active:translate-y-[2px]
              active:shadow-none
              transition-all
              duration-75
            "
          >

            {#if isOptimizing}
              Stop
            {:else}
              Auto Step
            {/if}

          </button>

          <button
            onclick={takeStep}
            disabled={isOptimizing}
            class="
              border
              border-[#141414]
              bg-[#FFFFFF]
              px-5
              font-mono
              uppercase
              tracking-wide
              text-xs
              shadow-[2px_2px_0px_#141414]
              hover:bg-[#F27D26]
              active:translate-x-[2px]
              active:translate-y-[2px]
              active:shadow-none
              transition-all
              duration-75
            "
          >
            Step
          </button>

        </div>

      </section>

      <!-- THETA -->
      <section
        class="
          bg-[#FFFFFF]
          border
          border-[#141414]
          p-5
          shadow-[2px_2px_0px_#141414]
          space-y-4
        "
      >

        <div>
          <h2 class="font-serif text-xl">
            Parameter θ
          </h2>

          <p class="italic text-xs opacity-60">
            optimization variable
          </p>
        </div>

        <div
          class="
            flex
            justify-between
            font-mono
            uppercase
            tracking-wide
            text-xs
          "
        >
          <span>θ value</span>
          <span>{currentX.toFixed(2)}</span>
        </div>

        <input
          type="range"
          min={xRange[0]}
          max={xRange[1]}
          step="0.01"
          bind:value={currentX}
          oninput={() => resetOptimization()}
          class="neo-slider w-full"
        />

      </section>

      <!-- NOTATION -->
      <section
        class="
          bg-[#FFFFFF]
          border
          border-[#141414]
          p-5
          shadow-[2px_2px_0px_#141414]
          space-y-5
        "
      >

        <div>
          <h2 class="font-serif text-2xl">
            Notation
          </h2>

          <p class="italic text-xs opacity-60">
            gradient terminology
          </p>
        </div>

        <div
          class="
            space-y-3
            font-mono
            uppercase
            tracking-wide
            text-xs
          "
        >

          <div class="flex justify-between border-b border-dashed border-[#141414]/20 pb-2">
            <span>θ</span>
            <span class="opacity-60">parameter</span>
          </div>

          <div class="flex justify-between border-b border-dashed border-[#141414]/20 pb-2">
            <span>L</span>
            <span class="opacity-60">loss</span>
          </div>

          <div class="flex justify-between border-b border-dashed border-[#141414]/20 pb-2">
            <span>η</span>
            <span class="opacity-60">learning rate</span>
          </div>

          <div class="flex justify-between border-b border-dashed border-[#141414]/20 pb-2">
            <span>dL/dθ</span>
            <span class="opacity-60">gradient</span>
          </div>

        </div>

      </section>

    </aside>

    <!-- MAIN -->
    <main
      class="
        flex-1
        p-8
        flex
        flex-col
        gap-6
        overflow-hidden
      "
    >

      <!-- GRAPH -->
      <div
        class="
          flex-1
          min-h-0
          bg-[#FFFFFF]
          border
          border-[#141414]
          shadow-[2px_2px_0px_#141414]
          overflow-hidden
        "
      >

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

      <!-- METRICS -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

        <!-- UPDATE -->
        <div
          class="
            bg-[#FFFFFF]
            border
            border-[#141414]
            p-5
            shadow-[2px_2px_0px_#141414]
          "
        >

          <h3 class="font-serif text-xl mb-3">
            Update
          </h3>

          <div
            class="
              font-mono
              uppercase
              tracking-wide
              text-xs
              opacity-60
              mb-4
            "
          >
            θ next
          </div>

          <div class="font-mono text-3xl">
            {isNaN(nextX)
              ? '—'
              : nextX.toFixed(3)}
          </div>

        </div>

        <!-- LOSS -->
        <div
          class="
            bg-[#FFFFFF]
            border
            border-[#141414]
            p-5
            shadow-[2px_2px_0px_#141414]
          "
        >

          <h3 class="font-serif text-xl mb-3">
            Loss
          </h3>

          <div
            class="
              font-mono
              uppercase
              tracking-wide
              text-xs
              opacity-60
              mb-4
            "
          >
            objective
          </div>

          <div class="font-mono text-3xl">
            {isNaN(currentLoss)
              ? '—'
              : currentLoss.toFixed(4)}
          </div>

        </div>

        <!-- GRADIENT -->
        <div
          class="
            bg-[#FFFFFF]
            border
            border-[#141414]
            p-5
            shadow-[2px_2px_0px_#141414]
          "
        >

          <h3 class="font-serif text-xl mb-3">
            Gradient
          </h3>

          <div
            class="
              font-mono
              uppercase
              tracking-wide
              text-xs
              opacity-60
              mb-4
            "
          >
            slope
          </div>

          <div class="font-mono text-3xl">
            {isNaN(lossGradient)
              ? '—'
              : lossGradient.toFixed(4)}
          </div>

        </div>

        <!-- OUTPUT -->
        <div
          class="
            bg-[#FFFFFF]
            border
            border-[#141414]
            p-5
            shadow-[2px_2px_0px_#141414]
          "
        >

          <h3 class="font-serif text-xl mb-3">
            Output
          </h3>

          <div
            class="
              font-mono
              uppercase
              tracking-wide
              text-xs
              opacity-60
              mb-4
            "
          >
            f(θ)
          </div>

          <div class="font-mono text-3xl">
            {isNaN(yAtX)
              ? '—'
              : yAtX.toFixed(3)}
          </div>

        </div>

      </div>

    </main>

  </div>
</div>

<style>
  :global(body) {
    background: #E4E3E0;
    color: #141414;
  }

  :global(.katex-display) {
    margin: 0;
  }

  :global(.neo-slider) {
    appearance: none;
    height: 2px;
    background: #14141433;
    outline: none;
  }

  :global(.neo-slider::-webkit-slider-thumb) {
    appearance: none;
    width: 14px;
    height: 14px;
    background: #141414;
    border: 1px solid #141414;
    cursor: pointer;
  }

  :global(.neo-slider::-webkit-slider-thumb:hover) {
    background: #F27D26;
  }

  :global(.neo-slider::-moz-range-thumb) {
    width: 14px;
    height: 14px;
    background: #141414;
    border: 1px solid #141414;
    cursor: pointer;
  }

  :global(.neo-slider::-moz-range-thumb:hover) {
    background: #F27D26;
  }
</style>
```
