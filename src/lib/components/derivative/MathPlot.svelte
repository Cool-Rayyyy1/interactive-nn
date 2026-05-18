<script lang="ts">
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { evaluateFunction } from  "$lib/math/derivative-math";

  interface Props {
    expression: string;
    xRange: [number, number];
    yRange: [number, number];
    currentX: number;
    h: number;
    history?: { x: number; y: number; iteration: number }[];
    targetY?: number;
    gradient?: number;
    learningRate?: number;
    width?: number;
    height?: number;
    minima?: { x: number; y: number }[];
  }

  let {
    expression,
    xRange,
    yRange,
    currentX,
    h,
    history = [],
    targetY = 0,
    gradient = 0,
    learningRate = 0.1,
    width = 600,
    height = 400,
    minima = [],
  }: Props = $props();

  let minX = $derived(xRange[0]);
  let maxX = $derived(xRange[1]);
  let minY = $derived(yRange[0]);
  let maxY = $derived(yRange[1]);

  function toSVGX(x: number) {
    return ((x - minX) / (maxX - minX)) * width;
  }

  function toSVGY(y: number) {
    return height - ((y - minY) / (maxY - minY)) * height;
  }

  let points = $derived.by(() => {
    const res = 150;
    const step = (maxX - minX) / res;
    const d: [number, number][] = [];
    for (let i = 0; i <= res; i++) {
      const x = minX + i * step;
      const y = evaluateFunction(expression, x);
      if (!isNaN(y) && isFinite(y)) {
        d.push([toSVGX(x), toSVGY(y)]);
      }
    }
    return d;
  });

  let mainPath = $derived.by(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`), '');
  });

  // Point P
  let pY = $derived(evaluateFunction(expression, currentX));
  
  // Spring animations for position
  const pxSpring = spring(toSVGX(currentX));
  const pySpring = spring(toSVGY(pY));

  // Update springs when currentX or expression changes
  $effect(() => {
    pxSpring.set(toSVGX(currentX));
    pySpring.set(toSVGY(pY));
  });

  // Tangent Line (Approximated)
  let epsilon = 0.0001;
  let fPlus = $derived(evaluateFunction(expression, currentX + epsilon));
  let fMinus = $derived(evaluateFunction(expression, currentX - epsilon));
  let mTangent = $derived((fPlus - fMinus) / (2 * epsilon));
  let bTangent = $derived(pY - mTangent * currentX);

  let tangentLine = $derived.by(() => {
    const yLeft = mTangent * minX + bTangent;
    const yRight = mTangent * maxX + bTangent;
    return {
      x1: toSVGX(minX),
      y1: toSVGY(yLeft),
      x2: toSVGX(maxX),
      y2: toSVGY(yRight)
    };
  });

  // Grid lines
  let gridLines = $derived.by(() => {
    const xLines = [];
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      xLines.push({ pos: toSVGX(x), val: x });
    }
    const yLines = [];
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      yLines.push({ pos: toSVGY(y), val: y });
    }
    return { xLines, yLines };
  });

  // Gradient visualization
  let gradDir = $derived(Math.sign(gradient || 0));
  let gradArrowLen = 35; 
  let gradXOffset = $derived(gradDir * gradArrowLen);
  let gradYOffset = $derived(mTangent * (gradXOffset / (width / (maxX - minX))) * (height / (maxY - minY)));

  // Update visualization
  let updateStepX = $derived(-(learningRate || 0.1) * (gradient || 0));
  let updateVisualScale = 80; 
  let updateXOffset = $derived(updateStepX * updateVisualScale);
  let updateYOffset = $derived(mTangent * (updateXOffset / (width / (maxX - minX))) * (height / (maxY - minY)));

  let isVisible = $derived(currentX >= minX && currentX <= maxX);

  // Spring animation for tangent and arrows
  const tangentSpring = spring(tangentLine);
  const gradSpring = spring({ x: gradXOffset, y: gradYOffset });
  const updateSpring = spring({ x: updateXOffset, y: updateYOffset });

  $effect(() => {
    tangentSpring.set(tangentLine);
    gradSpring.set({ x: gradXOffset, y: gradYOffset });
    updateSpring.set({ x: updateXOffset, y: updateYOffset });
  });

</script>

<div class="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full h-full">
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 {width} {height}"
    class="touch-none"
  >
    <defs>
      <marker id="grad-arrow" markerWidth="8" markerHeight="6" 
        refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#f43f5e" />
      </marker>
      <marker id="update-arrow" markerWidth="8" markerHeight="6" 
        refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
      </marker>
    </defs>

    <!-- Grid & Axis Numbers -->
    <g class="text-slate-200">
      {#each gridLines.xLines as line}
        <line x1={line.pos} y1={0} x2={line.pos} y2={height} stroke="currentColor" stroke-width="1" class="opacity-30" />
        {#if Math.abs(line.val) > 0.1}
          <text x={line.pos} y={toSVGY(0) + 14} font-size="8" text-anchor="middle" fill="#94a3b8" font-weight="black">{line.val}</text>
        {/if}
      {/each}
      {#each gridLines.yLines as line}
        <line x1={0} y1={line.pos} x2={width} y2={line.pos} stroke="currentColor" stroke-width="1" class="opacity-30" />
        {#if Math.abs(line.val) > 0.1}
          <text x={toSVGX(0) - 8} y={line.pos + 3} font-size="8" text-anchor="end" fill="#94a3b8" font-weight="black">{line.val}</text>
        {/if}
      {/each}
    </g>

    <!-- Origin Label -->
    <text x={toSVGX(0) - 8} y={toSVGY(0) + 14} font-size="8" text-anchor="end" fill="#94a3b8" font-weight="black">0</text>

    <!-- Local Minima points -->
    <g>
      {#each minima as m}
        <circle
          cx={toSVGX(m.x)}
          cy={toSVGY(m.y)}
          r="5"
          fill="#f43f5e"
          stroke="white"
          stroke-width="2"
          transition:fade
        />
      {/each}
    </g>

    <!-- Axes -->
    <line x1={0} y1={toSVGY(0)} x2={width} y2={toSVGY(0)} stroke="#cbd5e1" stroke-width="2" />
    <line x1={toSVGX(0)} y1={0} x2={toSVGX(0)} y2={height} stroke="#cbd5e1" stroke-width="2" />
    
    <!-- Axis Labels -->
    <text x={width - 5} y={toSVGY(0) - 10} font-size="12" text-anchor="end" fill="#64748b" font-weight="bold" class="italic font-serif">θ</text>
    <text x={toSVGX(0) + 10} y={15} font-size="12" text-anchor="start" fill="#64748b" font-weight="bold" class="italic font-serif">f(θ)</text>

    <!-- Target Y Line -->
    <line 
      x1={0} 
      y1={toSVGY(targetY)} 
      x2={width} 
      y2={toSVGY(targetY)} 
      stroke="#6366f1" 
      stroke-width="1.5" 
      stroke-dasharray="10 5" 
      class="opacity-40"
    />
    <text x={10} y={toSVGY(targetY) - 5} font-size="9" font-weight="black" fill="#6366f1" class="uppercase tracking-widest opacity-60">Target: {targetY.toFixed(3)}</text>

    <!-- Function Plot -->
    <path
      d={mainPath}
      fill="none"
      stroke="#94a3b8"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="opacity-40 transition-all duration-500"
    />

    <!-- Trail History -->
    <g>
      {#each history as h}
        <circle
          cx={toSVGX(h.x)}
          cy={toSVGY(h.y)}
          r="3"
          fill="#cbd5e1"
          class="opacity-50"
          transition:fade
        />
      {/each}
    </g>

    {#if isVisible}
      <!-- Tangent Line -->
      <line
        x1={$tangentSpring.x1}
        y1={$tangentSpring.y1}
        x2={$tangentSpring.x2}
        y2={$tangentSpring.y2}
        stroke="#f43f5e"
        stroke-width="1.5"
        stroke-dasharray="4 2"
        class="opacity-60"
      />

      <!-- Gradient Line & Update Arrows -->
      {#if Math.abs(gradient || 0) > 0.001}
        <g>
          <!-- Red Gradient Arrow (Direction of Increasing Loss) -->
          <line
            x1={$pxSpring}
            y1={$pySpring}
            x2={$pxSpring + $gradSpring.x}
            y2={$pySpring - $gradSpring.y}
            stroke="#f43f5e"
            stroke-width="2.5"
            marker-end="url(#grad-arrow)"
            class="opacity-80"
          />
          <text
            x={$pxSpring + $gradSpring.x + (gradDir * 10)}
            y={$pySpring - $gradSpring.y - 10}
            font-size="9"
            font-weight="bold"
            fill="#f43f5e"
            text-anchor={gradDir > 0 ? "start" : "end"}
            class="uppercase tracking-tighter"
          >
            dL/dθ
          </text>

          <!-- Blue Update Arrow (Direction of Step - Reverse Gradient) -->
          <line
            x1={$pxSpring}
            y1={$pySpring}
            x2={$pxSpring + $updateSpring.x}
            y2={$pySpring - $updateSpring.y}
            stroke="#3b82f6"
            stroke-width="4"
            marker-end="url(#update-arrow)"
          />
          <text
            x={$pxSpring + $updateSpring.x / 2}
            y={$pySpring - $updateSpring.y + 20}
            font-size="9"
            font-weight="bold"
            fill="#3b82f6"
            text-anchor="middle"
            class="uppercase tracking-tighter"
          >
            -η dL/dθ (Step)
          </text>
        </g>
      {/if}

      <!-- Point P -->
      <circle
        cx={$pxSpring}
        cy={$pySpring}
        r="8"
        fill="#f43f5e"
        stroke="white"
        stroke-width="2"
        class="shadow-xl"
      />

      <!-- Labels for points -->
      <text 
        x={$pxSpring}
        y={$pySpring - 15}
        font-size="11" 
        text-anchor="middle" 
        font-weight="black" 
        fill="#1e293b" 
        class="font-sans uppercase tracking-tighter"
      >
        Parameter (θ)
      </text>
    {/if}
  </svg>
</div>
