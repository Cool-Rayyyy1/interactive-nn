<script lang="ts">
  import { evaluateFunction } from '$lib/math/derivative-math';
  import { spring } from 'svelte/motion';

  // Svelte 5 props
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
    minima = []
  } = $props();

  // Reactive bounds
  let minX = $derived(xRange[0]);
  let maxX = $derived(xRange[1]);
  let minY = $derived(yRange[0]);
  let maxY = $derived(yRange[1]);

  // Coordinate transforms
  function toSVGX(x: number) {
    return ((x - minX) / (maxX - minX)) * width;
  }
  function toSVGY(y: number) {
    return height - ((y - minY) / (maxY - minY)) * height;
  }

  // Generate main graph path
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

  let mainPath = $derived(
    points.length === 0
      ? ''
      : points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`), '')
  );

  // Point P
  let pY = $derived(evaluateFunction(expression, currentX));
  let pxVal = $derived(toSVGX(currentX));
  let pyVal = $derived(toSVGY(pY));

  // Springs for smooth movement of point P and arrow overlays
  let pSpring = spring({ x: pxVal, y: pyVal }, { stiffness: 0.12, damping: 0.75 });
  $effect(() => {
    pSpring.set({ x: pxVal, y: pyVal });
  });

  // Tangent Line (Approximated)
  let epsilon = 0.0001;
  let fPlus = $derived(evaluateFunction(expression, currentX + epsilon));
  let fMinus = $derived(evaluateFunction(expression, currentX - epsilon));
  let mTangent = $derived((fPlus - fMinus) / (2 * epsilon));
  let bTangent = $derived(pY - mTangent * currentX);

  let tangentLinePoints = $derived.by(() => {
    const yLeft = mTangent * minX + bTangent;
    const yRight = mTangent * maxX + bTangent;
    return {
      x1: toSVGX(minX),
      y1: toSVGY(yLeft),
      x2: toSVGX(maxX),
      y2: toSVGY(yRight)
    };
  });

  // Spring for tangent line endpoints
  let tangentSpring = spring(
    { x1: tangentLinePoints.x1, y1: tangentLinePoints.y1, x2: tangentLinePoints.x2, y2: tangentLinePoints.y2 },
    { stiffness: 0.12, damping: 0.75 }
  );
  $effect(() => {
    tangentSpring.set({
      x1: tangentLinePoints.x1,
      y1: tangentLinePoints.y1,
      x2: tangentLinePoints.x2,
      y2: tangentLinePoints.y2
    });
  });

  // Grid lines
  let gridLinesX = $derived.by(() => {
    const lines = [];
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      lines.push({ pos: toSVGX(x), val: x });
    }
    return lines;
  });

  let gridLinesY = $derived.by(() => {
    const lines = [];
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      lines.push({ pos: toSVGY(y), val: y });
    }
    return lines;
  });

  // Gradient Arrow calculations
  let gradDir = $derived(Math.sign(gradient));
  let gradArrowLen = 35;
  let gradXOffset = $derived(gradDir * gradArrowLen);
  let gradYOffset = $derived(mTangent * (gradXOffset / (width / (maxX - minX))) * (height / (maxY - minY)));

  // Update Arrow calculations
  let updateStepX = $derived(-learningRate * gradient);
  let updateVisualScale = 80;
  let updateXOffset = $derived(updateStepX * updateVisualScale);
  let updateYOffset = $derived(mTangent * (updateXOffset / (width / (maxX - minX))) * (height / (maxY - minY)));

  // Springs for overlay arrows to glide smoothly
  let overlaysSpring = spring(
    { gradX: 0, gradY: 0, updateX: 0, updateY: 0 },
    { stiffness: 0.12, damping: 0.75 }
  );
  $effect(() => {
    overlaysSpring.set({
      gradX: gradXOffset,
      gradY: gradYOffset,
      updateX: updateXOffset,
      updateY: updateYOffset
    });
  });

  let isVisible = $derived(currentX >= minX && currentX <= maxX);
</script>

<div class="relative bg-white border-2 bg-[#f5f5f5] overflow-hidden w-full h-full">
  <svg 
    width="100%" 
    height="100%" 
    viewBox="0 0 {width} {height}"
    class="touch-none font-mono"
  >
    <defs>
      <marker id="grad-arrow" markerWidth="8" markerHeight="6" 
        refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#F27D26" />
      </marker>
      <marker id="update-arrow" markerWidth="8" markerHeight="6" 
        refX="0" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#141414" />
      </marker>
    </defs>

    <!-- Grid & Axis Numbers -->
    <g class="text-[#141414]/10">
      {#each gridLinesX as line (line.val)}
        <line x1={line.pos} y1={0} x2={line.pos} y2={height} stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
        {#if Math.abs(line.val) > 0.1}
          <text x={line.pos} y={toSVGY(0) + 14} font-size="9" text-anchor="middle" fill="#141414" font-weight="bold" class="font-mono">{line.val}</text>
        {/if}
      {/each}
      {#each gridLinesY as line (line.val)}
        <line x1={0} y1={line.pos} x2={width} y2={line.pos} stroke="currentColor" stroke-width="1" stroke-dasharray="2 2" />
        {#if Math.abs(line.val) > 0.1}
          <text x={toSVGX(0) - 8} y={line.pos + 3} font-size="9" text-anchor="end" fill="#141414" font-weight="bold" class="font-mono">{line.val}</text>
        {/if}
      {/each}
    </g>

    <!-- Origin Label -->
    <text x={toSVGX(0) - 8} y={toSVGY(0) + 14} font-size="9" text-anchor="end" fill="#141414" font-weight="bold" class="font-mono">0</text>

    <!-- Local Minima points -->
    <g>
      {#each minima as m, idx (m.x)}
        <circle
          cx={toSVGX(m.x)}
          cy={toSVGY(m.y)}
          r="6"
          fill="#F27D26"
          stroke="#141414"
          stroke-width="2"
        />
      {/each}
    </g>

    <!-- Axes -->
    <line x1={0} y1={toSVGY(0)} x2={width} y2={toSVGY(0)} stroke="#141414" stroke-width="2" />
    <line x1={toSVGX(0)} y1={0} x2={toSVGX(0)} y2={height} stroke="#141414" stroke-width="2" />
    
    <!-- Axis Labels -->
    <text x={width - 10} y={toSVGY(0) - 10} font-size="13" text-anchor="end" fill="#141414" font-weight="black" class="font-mono">θ</text>
    <text x={toSVGX(0) + 10} y={18} font-size="13" text-anchor="start" fill="#141414" font-weight="black" class="font-mono">L(θ)</text>

    <!-- Target Y Line -->
    <line 
      x1={0} 
      y1={toSVGY(targetY)} 
      x2={width} 
      y2={toSVGY(targetY)} 
      stroke="#141414" 
      stroke-width="1.5" 
      stroke-dasharray="4 4" 
      class="opacity-40"
    />
    <text x={10} y={toSVGY(targetY) - 5} font-size="9" font-weight="bold" fill="#141414" class="font-mono uppercase tracking-wider opacity-60">Min L(θ): {targetY.toFixed(3)}</text>

    <!-- Function Plot -->
    <path
      d={mainPath}
      fill="none"
      stroke="#141414"
      stroke-width="2.5"
      stroke-linecap="square"
      stroke-linejoin="miter"
      class="transition-all duration-500"
    />

    <!-- Trail History -->
    <g>
      {#each history as h (h.iteration)}
        <circle
          cx={toSVGX(h.x)}
          cy={toSVGY(h.y)}
          r="4"
          fill="#FFFFFF"
          stroke="#141414"
          stroke-width="1.5"
          opacity="0.8"
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
        stroke="#141414"
        stroke-width="1.5"
        stroke-dasharray="3 3"
        class="opacity-50"
      />

      <!-- Gradient Line & Update Arrows -->
      {#if Math.abs(gradient) > 0.001}
        <g>
          <!-- Orange Gradient Arrow (Direction of Increasing Loss) -->
          <line
            x1={$pSpring.x}
            y1={$pSpring.y}
            x2={$pSpring.x + $overlaysSpring.gradX}
            y2={$pSpring.y - $overlaysSpring.gradY}
            stroke="#F27D26"
            stroke-width="2.5"
            marker-end="url(#grad-arrow)"
          />
          <text
            x={$pSpring.x + $overlaysSpring.gradX + (gradDir * 10)}
            y={$pSpring.y - $overlaysSpring.gradY - 10}
            font-size="10"
            font-weight="black"
            fill="#F27D26"
            text-anchor={gradDir > 0 ? "start" : "end"}
            class="font-mono uppercase tracking-wider"
          >
            dL/dθ
          </text>

          <!-- Dark Ink Update Arrow (Direction of Step - Reverse Gradient) -->
          <line
            x1={$pSpring.x}
            y1={$pSpring.y}
            x2={$pSpring.x + $overlaysSpring.updateX}
            y2={$pSpring.y - $overlaysSpring.updateY}
            stroke="#141414"
            stroke-width="3.5"
            marker-end="url(#update-arrow)"
          />
          <text
            x={$pSpring.x + $overlaysSpring.updateX / 2}
            y={$pSpring.y - $overlaysSpring.updateY + 20}
            font-size="10"
            font-weight="black"
            fill="#141414"
            text-anchor="middle"
            class="font-mono uppercase tracking-wider bg-white px-1"
          >
            -η dL/dθ (Step)
          </text>
        </g>
      {/if}

      <!-- Point P -->
      <circle
        cx={$pSpring.x}
        cy={$pSpring.y}
        r="9"
        fill="#F27D26"
        stroke="#141414"
        stroke-width="2"
      />

      <!-- Labels for points -->
      <text 
        x={$pSpring.x}
        y={$pSpring.y - 18}
        font-size="11" 
        text-anchor="middle" 
        font-weight="black" 
        fill="#141414" 
        class="font-mono uppercase tracking-wider"
      >
        θ
      </text>
    {/if}
  </svg>
</div>
