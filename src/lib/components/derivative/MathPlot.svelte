```svelte
<script lang="ts">
  import { spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  import { evaluateFunction } from "$lib/math/derivative-math";

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

    return points.reduce(
      (acc, [x, y], i) =>
        acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`),
      ''
    );
  });

  let pY = $derived(evaluateFunction(expression, currentX));

  const pxSpring = spring(toSVGX(currentX));
  const pySpring = spring(toSVGY(pY));

  $effect(() => {
    pxSpring.set(toSVGX(currentX));
    pySpring.set(toSVGY(pY));
  });

  let epsilon = 0.0001;

  let fPlus = $derived(
    evaluateFunction(expression, currentX + epsilon)
  );

  let fMinus = $derived(
    evaluateFunction(expression, currentX - epsilon)
  );

  let mTangent = $derived(
    (fPlus - fMinus) / (2 * epsilon)
  );

  let bTangent = $derived(
    pY - mTangent * currentX
  );

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

  let gridLines = $derived.by(() => {
    const xLines = [];

    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x++) {
      xLines.push({
        pos: toSVGX(x),
        val: x
      });
    }

    const yLines = [];

    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      yLines.push({
        pos: toSVGY(y),
        val: y
      });
    }

    return { xLines, yLines };
  });

  let gradDir = $derived(Math.sign(gradient || 0));

  let gradArrowLen = 35;

  let gradXOffset = $derived(
    gradDir * gradArrowLen
  );

  let gradYOffset = $derived(
    mTangent *
      (gradXOffset / (width / (maxX - minX))) *
      (height / (maxY - minY))
  );

  let updateStepX = $derived(
    -(learningRate || 0.1) * (gradient || 0)
  );

  let updateVisualScale = 80;

  let updateXOffset = $derived(
    updateStepX * updateVisualScale
  );

  let updateYOffset = $derived(
    mTangent *
      (updateXOffset / (width / (maxX - minX))) *
      (height / (maxY - minY))
  );

  let isVisible = $derived(
    currentX >= minX && currentX <= maxX
  );

  const tangentSpring = spring(tangentLine);

  const gradSpring = spring({
    x: gradXOffset,
    y: gradYOffset
  });

  const updateSpring = spring({
    x: updateXOffset,
    y: updateYOffset
  });

  $effect(() => {
    tangentSpring.set(tangentLine);

    gradSpring.set({
      x: gradXOffset,
      y: gradYOffset
    });

    updateSpring.set({
      x: updateXOffset,
      y: updateYOffset
    });
  });
</script>

<div
  class="
    relative
    w-full
    h-full
    overflow-hidden
    bg-[#FFFFFF]
    border
    border-[#141414]
    shadow-[2px_2px_0px_#141414]
  "
>
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 {width} {height}"
    class="touch-none bg-[#E4E3E0]"
  >
    <defs>
      <marker
        id="grad-arrow"
        markerWidth="8"
        markerHeight="6"
        refX="0"
        refY="3"
        orient="auto"
      >
        <polygon
          points="0 0, 8 3, 0 6"
          fill="#F27D26"
        />
      </marker>

      <marker
        id="update-arrow"
        markerWidth="8"
        markerHeight="6"
        refX="0"
        refY="3"
        orient="auto"
      >
        <polygon
          points="0 0, 8 3, 0 6"
          fill="#141414"
        />
      </marker>
    </defs>

    <!-- GRID -->
    <g class="font-mono">
      {#each gridLines.xLines as line}
        <line
          x1={line.pos}
          y1={0}
          x2={line.pos}
          y2={height}
          stroke="#14141422"
          stroke-width="1"
          stroke-dasharray="3 3"
        />

        {#if Math.abs(line.val) > 0.1}
          <text
            x={line.pos}
            y={toSVGY(0) + 16}
            font-size="8"
            text-anchor="middle"
            fill="#14141488"
            class="uppercase tracking-wide"
          >
            {line.val}
          </text>
        {/if}
      {/each}

      {#each gridLines.yLines as line}
        <line
          x1={0}
          y1={line.pos}
          x2={width}
          y2={line.pos}
          stroke="#14141422"
          stroke-width="1"
          stroke-dasharray="3 3"
        />

        {#if Math.abs(line.val) > 0.1}
          <text
            x={toSVGX(0) - 8}
            y={line.pos + 3}
            font-size="8"
            text-anchor="end"
            fill="#14141488"
            class="uppercase tracking-wide"
          >
            {line.val}
          </text>
        {/if}
      {/each}
    </g>

    <!-- ORIGIN -->
    <text
      x={toSVGX(0) - 8}
      y={toSVGY(0) + 16}
      font-size="8"
      text-anchor="end"
      fill="#14141488"
      class="font-mono uppercase tracking-wide"
    >
      0
    </text>

    <!-- MINIMA -->
    <g>
      {#each minima as m}
        <circle
          cx={toSVGX(m.x)}
          cy={toSVGY(m.y)}
          r="5"
          fill="#F27D26"
          stroke="#141414"
          stroke-width="1.5"
          transition:fade
        />
      {/each}
    </g>

    <!-- AXES -->
    <line
      x1={0}
      y1={toSVGY(0)}
      x2={width}
      y2={toSVGY(0)}
      stroke="#141414"
      stroke-width="1.5"
    />

    <line
      x1={toSVGX(0)}
      y1={0}
      x2={toSVGX(0)}
      y2={height}
      stroke="#141414"
      stroke-width="1.5"
    />

    <!-- AXIS LABELS -->
    <text
      x={width - 8}
      y={toSVGY(0) - 10}
      font-size="14"
      text-anchor="end"
      fill="#141414"
      style="font-family: Playfair Display, serif;"
      class="italic"
    >
      θ
    </text>

    <text
      x={toSVGX(0) + 12}
      y={18}
      font-size="14"
      text-anchor="start"
      fill="#141414"
      style="font-family: Playfair Display, serif;"
      class="italic"
    >
      f(θ)
    </text>

    <!-- TARGET -->
    <line
      x1={0}
      y1={toSVGY(targetY)}
      x2={width}
      y2={toSVGY(targetY)}
      stroke="#F27D26"
      stroke-width="1.5"
      stroke-dasharray="3 1.5"
      opacity="0.75"
    />

    <text
      x={10}
      y={toSVGY(targetY) - 6}
      font-size="8"
      fill="#141414"
      class="font-mono uppercase tracking-[0.2em]"
    >
      target {targetY.toFixed(3)}
    </text>

    <!-- FUNCTION -->
    <path
      d={mainPath}
      fill="none"
      stroke="#141414"
      stroke-width="2"
      stroke-linecap="square"
      stroke-linejoin="miter"
      opacity="0.9"
    />

    <!-- HISTORY -->
    <g>
      {#each history as h}
        <circle
          cx={toSVGX(h.x)}
          cy={toSVGY(h.y)}
          r="2.5"
          fill="#14141466"
          transition:fade
        />
      {/each}
    </g>

    {#if isVisible}

      <!-- TANGENT -->
      <line
        x1={$tangentSpring.x1}
        y1={$tangentSpring.y1}
        x2={$tangentSpring.x2}
        y2={$tangentSpring.y2}
        stroke="#F27D26"
        stroke-width="1.5"
        stroke-dasharray="3 1.5"
      />

      {#if Math.abs(gradient || 0) > 0.001}

        <!-- GRADIENT -->
        <line
          x1={$pxSpring}
          y1={$pySpring}
          x2={$pxSpring + $gradSpring.x}
          y2={$pySpring - $gradSpring.y}
          stroke="#F27D26"
          stroke-width="2"
          marker-end="url(#grad-arrow)"
        />

        <text
          x={$pxSpring + $gradSpring.x + (gradDir * 10)}
          y={$pySpring - $gradSpring.y - 10}
          font-size="8"
          fill="#F27D26"
          text-anchor={gradDir > 0 ? "start" : "end"}
          class="font-mono uppercase tracking-wide"
        >
          dL/dθ
        </text>

        <!-- UPDATE -->
        <line
          x1={$pxSpring}
          y1={$pySpring}
          x2={$pxSpring + $updateSpring.x}
          y2={$pySpring - $updateSpring.y}
          stroke="#141414"
          stroke-width="3"
          marker-end="url(#update-arrow)"
        />

        <text
          x={$pxSpring + $updateSpring.x / 2}
          y={$pySpring - $updateSpring.y + 18}
          font-size="8"
          fill="#141414"
          text-anchor="middle"
          class="font-mono uppercase tracking-wide"
        >
          -η dL/dθ
        </text>

      {/if}

      <!-- ACTIVE POINT -->
      <circle
        cx={$pxSpring}
        cy={$pySpring}
        r="7"
        fill="#141414"
        stroke="#E4E3E0"
        stroke-width="2"
      />

      <!-- LABEL -->
      <text
        x={$pxSpring}
        y={$pySpring - 18}
        font-size="9"
        text-anchor="middle"
        fill="#141414"
        class="font-mono uppercase tracking-[0.2em]"
      >
        parameter θ
      </text>

    {/if}
  </svg>
</div>
```
