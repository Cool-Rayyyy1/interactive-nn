<script lang="ts" module>
  export const ssr = false;
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Katex from 'svelte-katex';

  let el: HTMLDivElement;
  let ro: ResizeObserver;
  let PlotlyRef: any;
  let ready = false;

  type Act = 'sign' | 'step' | 'tanh' | 'sigmoid' | 'relu';

  // 每个 neuron：有 w1, w2, act
  type Neuron = { w1: number; w2: number; act: Act };
  type WeightKey = 'w1' | 'w2';

  const MAX_NEURONS = 3;

  // ===== 真正生效的网络结构（用于计算 & 绘图） =====
  let activation: Act = 'sign';   // Σ 后的输出激活（只在 neuronCount > 1 时生效）
  let neuronCount = 1;
  let neurons: Neuron[] = [];
  let bias = 0; // shared b

  // ===== 顶部 UI 状态 =====
  let neuronCountDraft: number = 1; // 上面下拉的草稿值
  let actPanelCount: number = 0;    // 上一次 Refresh 后的面板 neuron 数

  let uiActivation: Act = 'sign';   // 面板上的 Output activation (after Σ)
  let uiNeuronActs: Act[] = [];     // 面板中每个 neuron 的激活函数
  let showActivationUI = false;     // 默认不显示 Activation UI

  // 默认权重模板
  const defaultTemplates = [
    { w1: 1,  w2: 2 },
    { w1: -2, w2: 1 },
    { w1: 1,  w2: -1 }
  ];

  function defaultNeuron(i: number): Neuron {
    const t = defaultTemplates[i] ?? defaultTemplates[0];
    return { ...t, act: 'sign' }; // 默认激活 sign
  }

  function makeDefaultNeurons(count: number): Neuron[] {
    const arr: Neuron[] = [];
    for (let i = 0; i < count; i++) arr.push(defaultNeuron(i));
    return arr;
  }

  // ===== 网格（Plotly） =====
  const xRange: [number, number] = [-5, 5];
  const yRange: [number, number] = [-5, 5];
  const steps = 120;

  const lin = (a: number, b: number, n: number) =>
    Array.from({ length: n }, (_, i) => a + (b - a) * (i / (n - 1)));

  const xs = lin(xRange[0], xRange[1], steps);
  const ys = lin(yRange[0], yRange[1], steps);

  // 激活函数
  function act(t: number, type: Act): number {
    switch (type) {
      case 'sign':    return t < 0 ? -1 : 1;
      case 'step':    return t >= 0 ? 1 : 0;
      case 'tanh':    return Math.tanh(t);
      case 'sigmoid': return 1 / (1 + Math.exp(-t));
      case 'relu':    return Math.max(0, t);
    }
  }

  // ===== 布局常量 =====
  const NEURON_CX = 210;   // neuron 整列往左一点
  const NEURON_R  = 28;

  const SIGMA_CX  = 360;
  const SIGMA_CY  = 150;
  const SIGMA_R   = 28;

  // 激活圆：更大一点
  const ACT_R = 20;

  // 1-neuron 情况下的激活圆位置：原来 Σ 再往右一些
  const SINGLE_ACT_CX = SIGMA_CX + 25;
  const SINGLE_ACT_CY = SIGMA_CY;

  // 三条输入在 neuron 圆上的等间距偏移（沿 y 方向）
  // 0: x1, 1: x2, 2: b
  const INPUT_OFFSETS = [
    -NEURON_R * 0.6, // 上
    0,               // 中
    NEURON_R * 0.6   // 下
  ];

  function neuronY(i: number, count: number): number {
    return 150 + (i - (count - 1) / 2) * 90;
  }

  // 多 neuron 情况下，每个 neuron 激活圆心 x
  function neuronActX(): number {
    // neuron 右边缘 + gap(加大) + activation 半径
    const gap = 35;
    return NEURON_CX + NEURON_R + gap + ACT_R;
  }

  // 从某点连到 Σ 圆边界（只在多 neuron 情况下使用）
  function sigmaEndXFrom(x0: number, y0: number): number {
    const dx = SIGMA_CX - x0;
    const dy = SIGMA_CY - y0;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return SIGMA_CX - (dx / len) * SIGMA_R;
  }
  function sigmaEndYFrom(x0: number, y0: number): number {
    const dx = SIGMA_CX - x0;
    const dy = SIGMA_CY - y0;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    return SIGMA_CY - (dy / len) * SIGMA_R;
  }

  // ===== 计算输入箭头在圆上的终点：等间距、对称 =====
  function inputEndX(slot: number, cy: number): number {
    const dy = INPUT_OFFSETS[slot] ?? 0;
    const v = NEURON_R * NEURON_R - dy * dy;
    const dx = v <= 0 ? 0 : Math.sqrt(v);
    // 左侧交点
    return NEURON_CX - dx;
  }

  function inputEndY(slot: number, cy: number): number {
    const dy = INPUT_OFFSETS[slot] ?? 0;
    return cy + dy;
  }

  // ==== w 标签 ====
  const superscripts = ['¹', '²', '³'];

  function w1Label(i: number): string {
    const sup = superscripts[i] ?? String(i + 1);
    return 'w₁' + sup;
  }
  function w2Label(i: number): string {
    const sup = superscripts[i] ?? String(i + 1);
    return 'w₂' + sup;
  }

  type LabelPos = { x: number; y: number };

  const W1_LABEL_POS_MAP: Record<number, LabelPos[]> = {
    1: [{ x: 120, y: 75 }],
    2: [
      { x: 130, y: 70 },
      { x: 127, y: 91 }
    ],
    3: [
      { x: 130, y: 57 },
      { x: 130, y: 84 },
      { x: 132, y: 108 }
    ]
  };

  const W2_LABEL_POS_MAP: Record<number, LabelPos[]> = {
    1: [{ x: 120, y: 145 }],
    2: [
      { x: 123, y: 133 },
      { x: 130, y: 160 }
    ],
    3: [
      { x: 112, y: 132 },
      { x: 127, y: 147 },
      { x: 127, y: 168 }
    ]
  };

  function getW1Cfg(i: number, count: number): LabelPos {
    const arr = W1_LABEL_POS_MAP[count] ?? W1_LABEL_POS_MAP[1];
    return arr[i] ?? arr[0];
  }
  function getW2Cfg(i: number, count: number): LabelPos {
    const arr = W2_LABEL_POS_MAP[count] ?? W2_LABEL_POS_MAP[1];
    return arr[i] ?? arr[0];
  }

  function w1LabelX(i: number, count: number): number {
    return getW1Cfg(i, count).x;
  }
  function w1LabelY(i: number, count: number): number {
    return getW1Cfg(i, count).y;
  }
  function w2LabelX(i: number, count: number): number {
    return getW2Cfg(i, count).x;
  }
  function w2LabelY(i: number, count: number): number {
    return getW2Cfg(i, count).y;
  }

  // ===== 顶部 UI：保证 uiNeuronActs 长度和 actPanelCount 对齐 =====
  function ensureUiNeuronActs(count: number) {
    const n = Math.min(MAX_NEURONS, Math.max(0, Number(count) || 0)); // 允许 0
    if (uiNeuronActs.length < n) {
      uiNeuronActs = [
        ...uiNeuronActs,
        ...Array.from({ length: n - uiNeuronActs.length }, () => 'sign' as Act)
      ];
    } else if (uiNeuronActs.length > n) {
      uiNeuronActs = uiNeuronActs.slice(0, n);
    }
  }

  $: ensureUiNeuronActs(actPanelCount);

  // ==== 权重更新 ====
  function updateNeuron(i: number, key: WeightKey, value: number) {
    neurons = neurons.map((neu, idx) =>
      idx === i ? { ...neu, [key]: value } : neu
    );
  }

  // ==== 计算输出曲面 ====
  // tᵢ = w₁,ᵢ x₁ + w₂,ᵢ x₂ + b
  // hᵢ = actᵢ(tᵢ)
  // neuronCount === 1: y = h₁
  // neuronCount ≥ 2:   y = act_out( Σᵢ hᵢ )
  function makeZ(): number[][] {
    const n = neuronCount;
    if (n <= 0 || neurons.length === 0) {
      return ys.map(() => xs.map(() => 0));
    }

    const b = Number(bias) || 0;

    if (n === 1 && neurons[0]) {
      const neu = neurons[0];
      return ys.map((x2) =>
        xs.map((x1) => {
          const t = neu.w1 * x1 + neu.w2 * x2 + b;
          return act(t, neu.act ?? 'sign');
        })
      );
    }

    return ys.map((x2) =>
      xs.map((x1) => {
        let sum = 0;
        for (let i = 0; i < n; i++) {
          const neu = neurons[i];
          if (!neu) continue;
          const t = neu.w1 * x1 + neu.w2 * x2 + b;
          const h = act(t, neu.act ?? 'sign');
          sum += h;
        }
        return act(sum, activation);
      })
    );
  }

  function zRange(z: number[][]): [number, number] {
    let min = Infinity, max = -Infinity;
    for (const row of z) {
      for (const v of row) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    const pad = 0.05 * Math.max(1, Math.abs(max - min));
    return [min - pad, max + pad];
  }

  // 绘图
  async function draw() {
    if (!ready || !el) return;
    const z = makeZ();
    const [_zmin, _zmax] = zRange(z);

    const actForColor: Act =
      neuronCount === 1 && neurons[0] ? neurons[0].act : activation;
    const isSigned = actForColor === 'sign' || actForColor === 'tanh';

    const data: any[] = [{
      type: 'surface',
      x: xs,
      y: ys,
      z,
      colorscale: isSigned ? 'RdBu' : 'Viridis',
      reversescale: isSigned,
      showscale: true,
      contours: { z: { show: false } },
      opacity: 1,
      hovertemplate: 'x₁: %{x:.2f}<br>x₂: %{y:.2f}<br>y: %{z:.2f}<extra></extra>'
    }];

    const layout: any = {
      margin: { l: 0, r: 0, t: 8, b: 0 },
      scene: {
        xaxis: { title: { text: 'x₁' } },
        yaxis: { title: { text: 'x₂' } },
        zaxis: { title: { text: 'y' }, range: [xRange[0], xRange[1]] }
      }
    };

    if (!(el as any)?._plotted) {
      await PlotlyRef.newPlot(el, data, layout, { responsive: true });
      (el as any)._plotted = true;
    } else {
      await PlotlyRef.react(el, data, layout);
    }
  }

  // ===== 应用当前 Activation 面板到真正网络结构（原来叫 Set/Draw 的逻辑） =====
  function applyStructure() {
    const n = actPanelCount > 0
      ? Math.min(MAX_NEURONS, actPanelCount)
      : 1;

    neuronCount = n;

    let next = neurons.slice(0, n);
    if (next.length < n) {
      const defaults = makeDefaultNeurons(n);
      for (let i = next.length; i < n; i++) next.push(defaults[i]);
    }

    // 设置每个 neuron 的激活
    next = next.map((neu, i) => ({
      ...neu,
      act: uiNeuronActs[i] ?? neu.act ?? 'sign'
    }));

    neurons = next;

    // 多 neuron 时才用 output activation
    if (n > 1) {
      activation = uiActivation;
    }
  }

  // 选完 neurons 后点击 Refresh：锁定当前 neuron 数量 & 显示激活 UI
  function handleRefresh() {
    const n = Math.min(
      MAX_NEURONS,
      Math.max(1, Number(neuronCountDraft) || 1)
    );

    actPanelCount = n;
    showActivationUI = true;

    // 初始化 uiNeuronActs，如果当前 neurons 有值就同步一下
    if (neurons.length < n) {
      neurons = makeDefaultNeurons(n);
    }
    uiNeuronActs = neurons.slice(0, n).map((neu) => neu.act ?? 'sign');

    if (n === 1) {
      // 1 个 neuron 时，唯一激活就是 neuron 自己的激活
      uiActivation = 'sign';
    }

    applyStructure();
  }

  onMount(async () => {
    activation   = 'sign';
    uiActivation = 'sign';

    neuronCount      = 1;
    neuronCountDraft = 1;

    actPanelCount = 0;
    uiNeuronActs = [];
    showActivationUI = false;

    neurons = makeDefaultNeurons(1);
    bias = 0;

    const mod = await import('plotly.js-dist-min');
    PlotlyRef = (mod as any).default ?? mod;
    ready = true;

    await draw();

    ro = new ResizeObserver(() => PlotlyRef.Plots.resize(el));
    ro.observe(el);
  });

  onDestroy(() => {
    ro?.disconnect();
  });
</script>

<svelte:window on:resize={() => ready && el && PlotlyRef.Plots.resize(el)} />

<div
  class="overflow-hidden grid gap-y-0"
  style="
    margin-left: var(--sidebar-w, 72px);
    width: calc(100% - var(--sidebar-w, 72px));
    height: 100dvh;
    min-height: 100vh;
    grid-template-rows: min-content 1fr;
    box-sizing: border-box;
  "
>
  <header class="box-border pr-3 pl-0 pt-2 pb-2">
    <h2 class="m-0 text-2xl font-semibold leading-tight">Single-Layer Perceptron</h2>

    <p class="mt-2 mb-1 text-base text-gray-700 w-full">
      This is a single-layer perceptron with 2 inputs x₁ and x₂.
      The first layer can have 1–3 neurons. All neurons share a single bias b.
      Each neuron has its own activation. With 2–3 neurons we sum their
      outputs and optionally apply one more activation after Σ. With 1 neuron
      there is only one activation in total.
    </p>

    <!-- 用 KaTeX 渲染概念公式 -->
    <div class="m-0 text-lg leading-snug">
      {#if neuronCount === 1}
        <Katex>
          y = f( w_1^1 x_1 + w_2^1 x_2 + b )
        </Katex>
      {:else}
        <Katex>
          t_i = w_1^i x_1 + w_2^i x_2 + b,\quad
          h_i = f_i(t_i),\quad
          y = g\left( \sum_i h_i \right)
        </Katex>
      {/if}
    </div>

    <!-- 顶部控制行 -->
    <div class="flex flex-wrap items-end gap-3 mt-3">
      <!-- Neuron count -->
      <div class="text-base">
        <label class="block text-sm text-gray-600 mb-1">Neurons (layer 1)</label>
        <select
          class="px-2 py-1 border rounded"
          bind:value={neuronCountDraft}
        >
          <option value={1}>1 neuron</option>
          <option value={2}>2 neurons</option>
          <option value={3}>3 neurons</option>
        </select>
      </div>

      <!-- Refresh -->
      <div class="text-base">
        <label class="block text-sm text-transparent mb-1">refresh</label>
        <button
          class="px-3 py-1 border rounded bg-gray-50 text-base"
          on:click={handleRefresh}
        >
          Refresh
        </button>
      </div>

      {#if showActivationUI && actPanelCount > 0}
        {#if actPanelCount === 1}
          <!-- 1 个 neuron：只有 Output activation（唯一激活） -->
          <div class="text-base">
            <label class="block text-sm text-gray-600 mb-1">
              Output activation (after Σ)
            </label>
            <select
              class="px-2 py-1 border rounded text-sm"
              bind:value={uiNeuronActs[0]}
            >
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">ReLU</option>
            </select>
          </div>

          <div class="text-base">
            <label class="block text-sm text-transparent mb-1">update</label>
            <button
              class="px-3 py-1 border rounded bg-gray-50 text-base"
              on:click={applyStructure}
            >
              Update
            </button>
          </div>
        {:else}
          <!-- 2 或 3 个 neuron：Neuron 1/2/3 activation + Output activation + Update -->
          {#each Array(actPanelCount) as _, i}
            <div class="text-base">
              <label class="block text-sm text-gray-600 mb-1">
                Neuron {i + 1} activation
              </label>
              <select
                class="px-2 py-1 border rounded text-sm"
                bind:value={uiNeuronActs[i]}
              >
                <option value="sign">sign</option>
                <option value="step">step</option>
                <option value="tanh">tanh</option>
                <option value="sigmoid">sigmoid</option>
                <option value="relu">ReLU</option>
              </select>
            </div>
          {/each}

          <div class="text-base">
            <label class="block text-sm text-gray-600 mb-1">
              Output activation (after Σ)
            </label>
            <select
              class="px-2 py-1 border rounded text-sm"
              bind:value={uiActivation}
            >
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">ReLU</option>
            </select>
          </div>

          <div class="text-base">
            <label class="block text-sm text-transparent mb-1">update</label>
            <button
              class="px-3 py-1 border rounded bg-gray-50 text-base"
              on:click={applyStructure}
            >
              Update
            </button>
          </div>
        {/if}
      {/if}
    </div>
  </header>

  <div
    class="grid h-full w-full"
    style="grid-template-columns: 1fr 1fr;"
  >
    <!-- 左：结构图 + 权重输入 -->
    <section class="min-w-0 min-h-0 box-border border rounded border-l-0 p-0 overflow-hidden">
      <div class="h-full w-full min-h-0 min-w-0 flex flex-col">
        <!-- 上：perceptron 结构图 -->
        <div class="flex-1 min-h-0">
          <svg viewBox="0 0 620 260" class="h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker
                id="arrow-head"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L8,4 L0,8 z" fill="#0f172a" />
              </marker>
              <marker
                id="arrow-green"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L8,4 L0,8 z" fill="#0f766e" />
              </marker>
            </defs>

            <!-- x₁ / x₂ / b -->
            <circle cx="80" cy="70" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x="80" y="75" font-size="15" text-anchor="middle" fill="#0f172a">x₁</text>

            <circle cx="80" cy="150" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x="80" y="155" font-size="15" text-anchor="middle" fill="#0f172a">x₂</text>

            <circle cx="80" cy="230" r="22" fill="#fef9c3" stroke="#f97316" stroke-width="1.2" />
            <text x="80" y="235" font-size="15" text-anchor="middle" fill="#c2410c">b</text>

            <!-- neurons 垂直排列 -->
            {#each neurons as neu, i}
              <!-- neuron 圆 -->
              <circle
                cx={NEURON_CX}
                cy={neuronY(i, neuronCount)}
                r={NEURON_R}
                fill="#dbeafe"
                stroke="#1d4ed8"
                stroke-width="1.6"
              />
              <text
                x={NEURON_CX}
                y={neuronY(i, neuronCount) + 6}
                font-size="12"
                text-anchor="middle"
                fill="#1d4ed8"
              >
                Neuron {i + 1}
              </text>

              <!-- x₁ → neuron：slot 0 -->
              <line
                x1={102}
                y1={70}
                x2={inputEndX(0, neuronY(i, neuronCount))}
                y2={inputEndY(0, neuronY(i, neuronCount))}
                stroke="#0f172a"
                stroke-width="1.2"
                marker-end="url(#arrow-head)"
              />
              <text
                x={w1LabelX(i, neuronCount)}
                y={w1LabelY(i, neuronCount)}
                font-size="11"
                text-anchor="middle"
                fill="#1d4ed8"
              >
                {w1Label(i)}
              </text>

              <!-- x₂ → neuron：slot 1 -->
              <line
                x1={102}
                y1={150}
                x2={inputEndX(1, neuronY(i, neuronCount))}
                y2={inputEndY(1, neuronY(i, neuronCount))}
                stroke="#0f172a"
                stroke-width="1.2"
                marker-end="url(#arrow-head)"
              />
              <text
                x={w2LabelX(i, neuronCount)}
                y={w2LabelY(i, neuronCount)}
                font-size="11"
                text-anchor="middle"
                fill="#1d4ed8"
              >
                {w2Label(i)}
              </text>

              <!-- b → neuron：slot 2 -->
              <line
                x1={102}
                y1={230}
                x2={inputEndX(2, neuronY(i, neuronCount))}
                y2={inputEndY(2, neuronY(i, neuronCount))}
                stroke="#f97316"
                stroke-width="1.1"
                marker-end="url(#arrow-green)"
              />
            {/each}

            {#if neuronCount > 1}
              <!-- 多 neuron：有 Σ + 每个 neuron 的激活圆 + 输出激活 -->
              <!-- Σ -->
              <circle
                cx={SIGMA_CX}
                cy={SIGMA_CY}
                r={SIGMA_R}
                fill="#e5e7eb"
                stroke="#0f172a"
                stroke-width="1.6"
              />
              <text
                x={SIGMA_CX}
                y={SIGMA_CY + 5}
                font-size="20"
                text-anchor="middle"
                fill="#0f172a"
              >
                Σ
              </text>

              {#each neurons as neu2, j}
                <!-- neuron → 激活圆：拉开一点距离 -->
                <line
                  x1={NEURON_CX + NEURON_R}
                  y1={neuronY(j, neuronCount)}
                  x2={neuronActX() - ACT_R}
                  y2={neuronY(j, neuronCount)}
                  stroke="#0f172a"
                  stroke-width="1.2"
                  marker-end="url(#arrow-head)"
                />

                <!-- 激活圆（变大） -->
                <circle
                  cx={neuronActX()}
                  cy={neuronY(j, neuronCount)}
                  r={ACT_R}
                  fill="#fef2f2"
                  stroke="#f97316"
                  stroke-width="1.2"
                />
                <text
                  x={neuronActX()}
                  y={neuronY(j, neuronCount) + 4}
                  font-size="9"
                  text-anchor="middle"
                  fill="#b91c1c"
                >
                  {neu2.act}
                </text>

                <!-- 激活圆 → Σ -->
                <line
                  x1={neuronActX() + ACT_R}
                  y1={neuronY(j, neuronCount)}
                  x2={sigmaEndXFrom(neuronActX() + ACT_R, neuronY(j, neuronCount))}
                  y2={sigmaEndYFrom(neuronActX() + ACT_R, neuronY(j, neuronCount))}
                  stroke="#0f172a"
                  stroke-width="1.2"
                  marker-end="url(#arrow-head)"
                />
              {/each}

              <!-- Σ 后输出激活 -->
              <rect
                x="439"
                y="122"
                width="85"
                height="56"
                rx="12"
                fill="#ecfdf3"
                stroke="#16a34a"
                stroke-width="1.4"
              />
              <text
                x="481.5"
                y="155"
                font-size="14"
                text-anchor="middle"
                fill="#166534"
              >
                {activation}
              </text>

              <!-- Σ → 输出激活 -->
              <line
                x1={SIGMA_CX + SIGMA_R}
                y1={SIGMA_CY}
                x2="439"
                y2="150"
                stroke="#0f172a"
                stroke-width="1.2"
                marker-end="url(#arrow-head)"
              />

              <!-- 输出激活 → y -->
              <line
                x1="524"
                y1="150"
                x2="575"
                y2="150"
                stroke="#0f172a"
                stroke-width="1.2"
                marker-end="url(#arrow-head)"
              />
            {:else}
              <!-- 单 neuron：不画 Σ，neuron → 大激活圆 → y -->
              {#if neurons[0]}
                <line
                  x1={NEURON_CX + NEURON_R}
                  y1={neuronY(0, 1)}
                  x2={SINGLE_ACT_CX - ACT_R}
                  y2={SINGLE_ACT_CY}
                  stroke="#0f172a"
                  stroke-width="1.2"
                  marker-end="url(#arrow-head)"
                />

                <circle
                  cx={SINGLE_ACT_CX}
                  cy={SINGLE_ACT_CY}
                  r={ACT_R}
                  fill="#fef2f2"
                  stroke="#f97316"
                  stroke-width="1.4"
                />
                <text
                  x={SINGLE_ACT_CX}
                  y={SINGLE_ACT_CY + 4}
                  font-size="10"
                  text-anchor="middle"
                  fill="#b91c1c"
                >
                  {neurons[0].act}
                </text>

                <line
                  x1={SINGLE_ACT_CX + ACT_R}
                  y1={SINGLE_ACT_CY}
                  x2="575"
                  y2="150"
                  stroke="#0f172a"
                  stroke-width="1.2"
                  marker-end="url(#arrow-head)"
                />
              {/if}
            {/if}

            <!-- 输出 y -->
            <circle cx="597" cy="150" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x="597" y="155" font-size="15" text-anchor="middle" fill="#0f172a">y</text>
          </svg>
        </div>

        <!-- 下：权重输入 + Draw -->
        <div class="border-t px-3 py-2 bg-gray-50 text-sm">
          <div class="font-medium mb-2">
            Weights for layer 1
            <span class="text-gray-600">
              (branch i: tᵢ = w₁,ᵢ·x₁ + w₂,ᵢ·x₂ + b, hᵢ = activationᵢ(tᵢ);
              if #neurons ≥ 2: y = activation<span style="font-size: 0.8em;">out</span>(Σᵢ hᵢ),
              else: y = h₁)
            </span>
          </div>

          <!-- bias b -->
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <div class="w-24 font-semibold">
              Bias b
            </div>
            <input
              type="number"
              class="w-24 px-1 py-0.5 border rounded font-mono text-xs"
              step="0.1"
              value={bias}
              on:input={(e) => {
                const v = (e.target as HTMLInputElement).valueAsNumber;
                bias = Number.isNaN(v) ? 0 : v;
              }}
            />
          </div>

          {#if neurons.length > 0}
            {#each neurons as neu, i}
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <div class="w-24 font-semibold">
                  Neuron {i + 1}
                </div>

                <label class="flex items-center gap-1">
                  <span>{w1Label(i)}</span>
                  <input
                    type="number"
                    class="w-20 px-1 py-0.5 border rounded font-mono text-xs"
                    step="0.1"
                    value={neu.w1}
                    on:input={(e) =>
                      updateNeuron(i, 'w1', (e.target as HTMLInputElement).valueAsNumber)
                    }
                  />
                </label>

                <label class="flex items-center gap-1">
                  <span>{w2Label(i)}</span>
                  <input
                    type="number"
                    class="w-20 px-1 py-0.5 border rounded font-mono text-xs"
                    step="0.1"
                    value={neu.w2}
                    on:input={(e) =>
                      updateNeuron(i, 'w2', (e.target as HTMLInputElement).valueAsNumber)
                    }
                  />
                </label>
              </div>
            {/each}
          {:else}
            <div class="text-gray-500">
              No neurons yet. Choose a number of neurons and click <strong>Refresh</strong>.
            </div>
          {/if}

          <div class="mt-2">
            <button
              class="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50"
              on:click={draw}
              disabled={!ready || neuronCount === 0}
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 右：Plotly 曲面图 -->
    <section class="min-w-0 min-h-0 box-border border rounded overflow-hidden relative">
      <div class="absolute inset-0 min-w-0 min-h-0 box-border" bind:this={el} />
    </section>
  </div>
</div>

<style>
  html, body { height: 100%; }
  body { margin: 0; overflow: hidden; }
  :root { --sidebar-w: 72px; }
</style>
