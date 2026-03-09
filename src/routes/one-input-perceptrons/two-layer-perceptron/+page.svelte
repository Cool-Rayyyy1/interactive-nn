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

  type NeuronL1 = { w1: number; w2: number; act: Act };
  type NeuronL2 = { ws: number[]; act: Act };

  type WeightKeyL1 = 'w1' | 'w2';

  const MAX_L1 = 4;
  const MAX_L2 = 2;

  // ===== 真正网络结构（计算 & 绘图）=====
  let l1Count = 1;
  let l2Count = 1;

  let l1Neurons: NeuronL1[] = [];
  let l2Neurons: NeuronL2[] = [];
  let bias = 0;
  let activationOut: Act = 'sign';

  // ===== 顶部 UI 草稿状态 =====
  let l1CountDraft: number = 1;
  let l2CountDraft: number = 1;

  let uiL1Acts: Act[] = [];
  let uiL2Acts: Act[] = [];
  let uiActivationOut: Act = 'sign';
  let showActivationUI = false;

  // ✅ 用于“抑制初始 1-1 日志”的开关
  let structureLocked = false;

  // ✅ KaTeX 用字符串变量（避免 {j,k} 被 Svelte 当 JS）
  let formulaLatex: string;

  // ===== 默认权重 =====
  const defaultTemplatesL1 = [
    { w1: 1,  w2: 2 },
    { w1: -2, w2: 1 },
    { w1: 1,  w2: -1 },
    { w1: -1, w2: -2 }
  ];

  function clampInt(v: any, min: number, max: number) {
    const n = Number(v);
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, Math.trunc(n)));
  }

  function defaultNeuronL1(i: number): NeuronL1 {
    const t = defaultTemplatesL1[i] ?? defaultTemplatesL1[0];
    return { ...t, act: 'sign' };
  }

  function makeDefaultL1(count: number): NeuronL1[] {
    const arr: NeuronL1[] = [];
    for (let i = 0; i < count; i++) arr.push(defaultNeuronL1(i));
    return arr;
  }

  function defaultNeuronL2(inDim: number): NeuronL2 {
    return {
      ws: Array.from({ length: inDim }, () => 1),
      act: 'sign'
    };
  }

  function makeDefaultL2(count: number, inDim: number): NeuronL2[] {
    const arr: NeuronL2[] = [];
    for (let i = 0; i < count; i++) arr.push(defaultNeuronL2(inDim));
    return arr;
  }

  // ============================================================
  // ✅✅✅ 结构：永远以 draft 为准（下拉框一改，结构立即改变）
  // ============================================================
  $: l1Count = clampInt(l1CountDraft, 1, MAX_L1);
  $: l2Count = clampInt(l2CountDraft, 1, MAX_L2);

  // ============================================================
  // ✅ 当 l1Count/l2Count 变化时：自动同步 neurons 数组与 ws 维度
  //     - 保留已存在的权重
  //     - 新增用默认补齐
  //     - ✅ act 永远补齐成 'sign'
  // ============================================================
  function syncNeuronsToCounts() {
    const n1 = l1Count;
    const n2 = l2Count;

    // Layer 1
    let nextL1 = l1Neurons.slice(0, n1);
    if (nextL1.length < n1) {
      const defaults = makeDefaultL1(n1);
      for (let i = nextL1.length; i < n1; i++) nextL1.push(defaults[i]);
    }
    nextL1 = nextL1.map((neu) => ({ ...neu, act: neu.act ?? 'sign' }));
    l1Neurons = nextL1;

    // Layer 2
    let nextL2 = l2Neurons.slice(0, n2);
    if (nextL2.length < n2) {
      const defaults2 = makeDefaultL2(n2, n1);
      for (let i = nextL2.length; i < n2; i++) nextL2.push(defaults2[i]);
    }
    nextL2 = nextL2.map((neu) => {
      let ws = neu.ws?.slice(0, n1) ?? [];
      if (ws.length < n1) ws = [...ws, ...Array(n1 - ws.length).fill(1)];
      return { ...neu, ws, act: neu.act ?? 'sign' };
    });
    l2Neurons = nextL2;

    if (l2Count === 1) {
      uiActivationOut = 'sign';
      activationOut = 'sign';
    }
  }
  $: syncNeuronsToCounts(l1Count, l2Count);

  // ============================================================
  // ✅ UI 的 act 数组长度也跟结构走（只负责 act，不负责 count）
  // ============================================================
  function ensureUiActs() {
    const n1 = l1Count;
    const n2 = l2Count;

    if (uiL1Acts.length < n1) {
      uiL1Acts = [
        ...uiL1Acts,
        ...Array.from({ length: n1 - uiL1Acts.length }, () => 'sign' as Act)
      ];
    } else if (uiL1Acts.length > n1) {
      uiL1Acts = uiL1Acts.slice(0, n1);
    }

    if (uiL2Acts.length < n2) {
      uiL2Acts = [
        ...uiL2Acts,
        ...Array.from({ length: n2 - uiL2Acts.length }, () => 'sign' as Act)
      ];
    } else if (uiL2Acts.length > n2) {
      uiL2Acts = uiL2Acts.slice(0, n2);
    }
  }
  $: ensureUiActs(l1Count, l2Count);

  // ============================================================
  // ✅✅✅ 你要的“上标风格”标签：w₁¹ / w₂¹；v₁¹ / v₂² ...
  // 约定：
  //  - w：下标 1/2 表示 x1/x2；上标 i 表示 L1 neuron i
  //  - v：下标 j 表示来自 L1 neuron j；上标 k 表示去 L2 neuron k
  // ============================================================
  const superscripts = ['¹', '²', '³', '⁴'];

  function sup(i0: number): string {
    // i0: 0-based
    return superscripts[i0] ?? String(i0 + 1);
  }

  function w1Label(i0: number): string {
    return `w₁${sup(i0)}`; // x1 -> L1 i
  }
  function w2Label(i0: number): string {
    return `w₂${sup(i0)}`; // x2 -> L1 i
  }

  function vLabel(j0: number, k0: number): string {
    // j0: from L1 index, k0: to L2 index
    // v_{j}^{k} => "vⱼᵏ"
    const sub = String(j0 + 1)
      .replaceAll('0', '₀')
      .replaceAll('1', '₁')
      .replaceAll('2', '₂')
      .replaceAll('3', '₃')
      .replaceAll('4', '₄')
      .replaceAll('5', '₅')
      .replaceAll('6', '₆')
      .replaceAll('7', '₇')
      .replaceAll('8', '₈')
      .replaceAll('9', '₉');
    return `v${sub}${sup(k0)}`;
  }

  // ============================================================
  // ✅ KaTeX 概念公式（也改成“上标风格”，且必须是字符串）
  // ============================================================
  $: {
    // L1: t^i = w1^i x1 + w2^i x2 + b; h^i = act1_i(t^i)
    // L2: s^k = Σ_i v_i^k h^i + b; g^k = act2_k(s^k)
    // out: if k=2 then y = act_out(g^1 + g^2)
    if (l2Count === 1) {
      formulaLatex =
        `t^{(1)}_i = w_1^{i} x_1 + w_2^{i} x_2 + b,\\quad h_i = \\operatorname{act}^{(1)}_i\\big(t^{(1)}_i\\big),\\\\` +
        `s^{(2)}_1 = \\sum_i v_i^{1} h_i + b,\\quad y = \\operatorname{act}^{(2)}_1\\big(s^{(2)}_1\\big)`;
    } else {
      formulaLatex =
        `t^{(1)}_i = w_1^{i} x_1 + w_2^{i} x_2 + b,\\quad h_i = \\operatorname{act}^{(1)}_i\\big(t^{(1)}_i\\big),\\\\` +
        `s^{(2)}_k = \\sum_i v_i^{k} h_i + b,\\quad g_k = \\operatorname{act}^{(2)}_k\\big(s^{(2)}_k\\big),\\\\` +
        `y = \\operatorname{act}_{\\text{out}}\\big(g_1 + g_2\\big)`;
    }
  }

  // ===== Plot 网格 =====
  const xRange: [number, number] = [-5, 5];
  const yRange: [number, number] = [-5, 5];
  const steps = 120;

  const lin = (a: number, b: number, n: number) =>
    Array.from({ length: n }, (_, i) => a + (b - a) * (i / (n - 1)));

  const xs = lin(xRange[0], xRange[1], steps);
  const ys = lin(yRange[0], yRange[1], steps);

  function actFn(t: number, type: Act): number {
    switch (type) {
      case 'sign':    return t < 0 ? -1 : 1;
      case 'step':    return t >= 0 ? 1 : 0;
      case 'tanh':    return Math.tanh(t);
      case 'sigmoid': return 1 / (1 + Math.exp(-t));
      case 'relu':    return Math.max(0, t);
    }
  }

  // ===== 结构图布局常量 =====
  const NEURON_R = 26;

  const INPUT_X1 = 80;
  const INPUT_Y1 = 70;
  const INPUT_X2 = 80;
  const INPUT_Y2 = 150;
  const INPUT_XB = 80;
  const INPUT_YB = 230;

  const L1_CX = 210;
  const L2_CX = 420;

  const OUT_CX = 660;
  const OUT_CY = 150;
  const OUT_R  = 22;

  const L1_ACT_R   = 18;
  const L1_ACT_GAP = 26;

  const L2_ACT_R   = 18;
  const L2_ACT_GAP = 30;

  const SIGMA2_CX = 540;
  const SIGMA2_CY = 150;
  const SIGMA2_R  = 24;

  const OUT_ACT_R  = 16;
  const OUT_ACT_CX = 605;
  const OUT_ACT_CY = 150;

  function layerY(i: number, count: number): number {
    const center = 150;
    const gap = count <= 2 ? 70 : 60;
    return center + (i - (count - 1) / 2) * gap;
  }

  const INPUT_OFFSETS = [
    -NEURON_R * 0.6,
    0,
    NEURON_R * 0.6
  ];

  function inputEndX(cx: number, _cy: number, slot: number): number {
    const dy = INPUT_OFFSETS[slot] ?? 0;
    const v = NEURON_R * NEURON_R - dy * dy;
    const dx = v <= 0 ? 0 : Math.sqrt(v);
    return cx - dx;
  }

  function inputEndY(_cx: number, cy: number, slot: number): number {
    const dy = INPUT_OFFSETS[slot] ?? 0;
    return cy + dy;
  }

  function l1ActX(): number {
    return L1_CX + NEURON_R + L1_ACT_GAP + L1_ACT_R;
  }

  function l2ActX(): number {
    return L2_CX + NEURON_R + L2_ACT_GAP + L2_ACT_R;
  }

  type Point = { x: number; y: number };
  type LinkAbs = { start: Point; end: Point };

  const LINK_ABS: Record<string, Record<number, Record<number, LinkAbs>>> = {
    "1-1": { 0: { 0: { start: { x: 300, y: 150 }, end: { x: 394, y: 150 } } } },

    "2-1": {
      0: {
        0: { start: { x: 298, y: 111 }, end: { x: 394, y: 142 } },
        1: { start: { x: 298, y: 191 }, end: { x: 394, y: 158 } }
      }
    },

    "3-1": {
      0: {
        0: { start: { x: 298, y: 80 }, end: { x: 394, y: 138 } },
        1: { start: { x: 298, y: 150 }, end: { x: 394, y: 150 } },
        2: { start: { x: 298, y: 220 }, end: { x: 394, y: 162 } }
      }
    },

    "4-1": {
      0: {
        0: { start: { x: 298, y: 48 }, end: { x: 394, y: 136 } },
        1: { start: { x: 298, y: 116 }, end: { x: 394, y: 144 } },
        2: { start: { x: 298, y: 184 }, end: { x: 394, y: 156 } },
        3: { start: { x: 298, y: 252 }, end: { x: 394, y: 164 } }
      }
    },

    "1-2": {
      0: { 0: { start: { x: 298, y: 143 }, end: { x: 394, y: 125 } } },
      1: { 0: { start: { x: 298, y: 157 }, end: { x: 394, y: 175 } } }
    },

    "2-2": {
      0: {
        0: { start: { x: 298, y: 110 }, end: { x: 394, y: 110 } },
        1: { start: { x: 298, y: 183 }, end: { x: 394, y: 117 } }
      },
      1: {
        0: { start: { x: 298, y: 117 }, end: { x: 394, y: 183 } },
        1: { start: { x: 298, y: 190 }, end: { x: 394, y: 190 } }
      }
    },

    "3-2": {
      0: {
        0: { start: { x: 298, y: 81 }, end: { x: 397, y: 100 } },
        1: { start: { x: 298, y: 147 }, end: { x: 394, y: 110 } },
        2: { start: { x: 298, y: 213 }, end: { x: 394, y: 120 } }
      },
      1: {
        0: { start: { x: 298, y: 87 }, end: { x: 397, y: 170 } },
        1: { start: { x: 298, y: 153 }, end: { x: 394, y: 180 } },
        2: { start: { x: 298, y: 219 }, end: { x: 394, y: 190 } }
      }
    },

    "4-2": {
      0: {
        0: { start: { x: 298, y: 50 }, end: { x: 397, y: 100 } },
        1: { start: { x: 298, y: 116 }, end: { x: 394, y: 110 } },
        2: { start: { x: 298, y: 184 }, end: { x: 394, y: 120 } },
        3: { start: { x: 298, y: 250 }, end: { x: 397, y: 130 } }
      },
      1: {
        0: { start: { x: 298, y: 50 }, end: { x: 397, y: 170 } },
        1: { start: { x: 298, y: 116 }, end: { x: 394, y: 180 } },
        2: { start: { x: 298, y: 184 }, end: { x: 394, y: 190 } },
        3: { start: { x: 298, y: 250 }, end: { x: 397, y: 200 } }
      }
    }
  };

  let l1Idxs: number[] = [];
  let l2Idxs: number[] = [];
  $: l1Idxs = Array.from({ length: Number(l1Count) || 0 }, (_, i) => i);
  $: l2Idxs = Array.from({ length: Number(l2Count) || 0 }, (_, i) => i);

  function l1L2Start(l1Idx: number, l2Idx: number) {
    const key = `${l1Count}-${l2Count}`;
    const link = LINK_ABS[key]?.[l2Idx]?.[l1Idx];

    if (structureLocked) {
      console.log("LINK", { key, l1Idx, l2Idx, l1Count, l2Count, link });
    }

    if (structureLocked && !link) {
      console.error(`🔴 Missing LINK_ABS["${key}"][${l2Idx}][${l1Idx}]`);
    }

    if (!link) return { x: l1ActX(), y: layerY(l1Idx, l1Count) };
    return link.start;
  }

  function l1L2End(l1Idx: number, l2Idx: number) {
    const key = `${l1Count}-${l2Count}`;
    const link = LINK_ABS[key]?.[l2Idx]?.[l1Idx];

    if (structureLocked && !link) {
      console.error(`🔴 Missing LINK_ABS["${key}"][${l2Idx}][${l1Idx}]`);
    }

    if (!link) return { x: L2_CX, y: layerY(l2Idx, l2Count) };
    return link.end;
  }

  function edgePointToward(
    x0: number,
    y0: number,
    cx: number,
    cy: number,
    r: number
  ) {
    const vx = x0 - cx;
    const vy = y0 - cy;
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    return {
      x: cx + (vx / len) * r,
      y: cy + (vy / len) * r
    };
  }

  function sigma2EndX(k: number) {
    const startX = l2ActX() + L2_ACT_R;
    const startY = layerY(k, l2Count);
    return edgePointToward(startX, startY, SIGMA2_CX, SIGMA2_CY, SIGMA2_R).x;
  }
  function sigma2EndY(k: number) {
    const startX = l2ActX() + L2_ACT_R;
    const startY = layerY(k, l2Count);
    return edgePointToward(startX, startY, SIGMA2_CX, SIGMA2_CY, SIGMA2_R).y;
  }

  function updateL1(i: number, key: WeightKeyL1, value: number) {
    l1Neurons = l1Neurons.map((neu, idx) =>
      idx === i ? { ...neu, [key]: value } : neu
    );
  }

  function updateL2(k: number, j: number, value: number) {
    l2Neurons = l2Neurons.map((neu, idx) => {
      if (idx !== k) return neu;
      const ws = neu.ws.slice();
      ws[j] = value;
      return { ...neu, ws };
    });
  }

  function makeZ(): number[][] {
    const n1 = l1Count;
    const n2 = l2Count;

    if (n1 <= 0 || n2 <= 0 || l1Neurons.length === 0 || l2Neurons.length === 0) {
      return ys.map(() => xs.map(() => 0));
    }

    const b = Number(bias) || 0;

    return ys.map((x2) =>
      xs.map((x1) => {
        const h: number[] = [];
        for (let j = 0; j < n1; j++) {
          const neu = l1Neurons[j];
          if (!neu) { h.push(0); continue; }
          const t1 = neu.w1 * x1 + neu.w2 * x2 + b;
          h.push(actFn(t1, neu.act ?? 'sign'));
        }

        if (n2 === 1) {
          const neu2 = l2Neurons[0];
          let s = b;
          for (let j = 0; j < n1; j++) s += (neu2.ws[j] ?? 0) * h[j];
          return actFn(s, neu2.act ?? 'sign');
        } else {
          let sumG = 0;
          for (let k = 0; k < n2; k++) {
            const neu2 = l2Neurons[k];
            let s = b;
            for (let j = 0; j < n1; j++) s += (neu2.ws[j] ?? 0) * h[j];
            sumG += actFn(s, neu2.act ?? 'sign');
          }
          return actFn(sumG, activationOut);
        }
      })
    );
  }

  async function draw() {
    if (!ready || !el) return;
    const z = makeZ();

    let actForColor: Act;
    if (l2Count === 1 && l2Neurons[0]) {
      actForColor = l2Neurons[0].act;
    } else {
      actForColor = activationOut;
    }

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
        zaxis: { title: { text: 'y' } }
      }
    };

    if (!(el as any)?._plotted) {
      await PlotlyRef.newPlot(el, data, layout, { responsive: true });
      (el as any)._plotted = true;
    } else {
      await PlotlyRef.react(el, data, layout);
    }
  }

  function applyActsOnly() {
    l1Neurons = l1Neurons.map((neu, i) => ({
      ...neu,
      act: uiL1Acts[i] ?? neu.act ?? 'sign'
    }));

    l2Neurons = l2Neurons.map((neu, k) => ({
      ...neu,
      act: uiL2Acts[k] ?? neu.act ?? 'sign'
    }));

    if (l2Count > 1) activationOut = uiActivationOut;
    if (l2Count === 1) activationOut = 'sign';
  }

  function handleRefresh() {
    showActivationUI = true;

    uiL1Acts = l1Neurons.slice(0, l1Count).map((neu) => neu.act ?? 'sign');
    uiL2Acts = l2Neurons.slice(0, l2Count).map((neu) => neu.act ?? 'sign');

    if (l2Count === 1) uiActivationOut = 'sign';
    if (l2Count > 1) uiActivationOut = activationOut ?? 'sign';

    structureLocked = true;
  }

  onMount(async () => {
    activationOut = 'sign';
    uiActivationOut = 'sign';

    l1CountDraft = 1;
    l2CountDraft = 1;

    showActivationUI = false;
    uiL1Acts = [];
    uiL2Acts = [];

    l1Neurons = makeDefaultL1(1);
    l2Neurons = makeDefaultL2(1, 1);
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
    min-height: 100vh;
    grid-template-rows: min-content 1fr;
    box-sizing: border-box;
  "
>
  <header class="box-border pr-3 pl-0 pt-2 pb-2">
    <h2 class="m-0 text-2xl font-semibold leading-tight">Two-Layer Perceptron</h2>

    <p class="mt-2 mb-1 text-base text-gray-700 w-full">
      This is a two-layer perceptron with 2 inputs x₁ and x₂.
      Layer 1 can have 1–4 neurons, layer 2 can have 1–2 neurons.
      All neurons share a single bias b.
      Layer 1 takes (x₁, x₂, b) and produces hᵢ.
      Layer 2 takes hᵢ and b and produces the final output y.
      If layer 2 has 2 neurons we sum their outputs and optionally apply one more
      activation after Σ.
    </p>

    <div class="m-0 text-lg leading-snug">
      <Katex>{formulaLatex}</Katex>
    </div>

    <div class="flex flex-wrap items-end gap-3 mt-3">
      <div class="text-base">
        <label class="block text-sm text-gray-600 mb-1">Neurons (layer 1)</label>
        <select class="px-2 py-1 border rounded" bind:value={l1CountDraft}>
          <option value={1}>1 neuron</option>
          <option value={2}>2 neurons</option>
          <option value={3}>3 neurons</option>
          <option value={4}>4 neurons</option>
        </select>
      </div>

      <div class="text-base">
        <label class="block text-sm text-gray-600 mb-1">Neurons (layer 2)</label>
        <select class="px-2 py-1 border rounded" bind:value={l2CountDraft}>
          <option value={1}>1 neuron</option>
          <option value={2}>2 neurons</option>
        </select>
      </div>

      <div class="text-base">
        <label class="block text-sm text-transparent mb-1">refresh</label>
        <button class="px-3 py-1 border rounded bg-gray-50 text-base" on:click={handleRefresh}>
          Refresh
        </button>
      </div>
    </div>

    {#if showActivationUI}
      <div class="flex flex-wrap items-end gap-3 mt-2">
        {#each Array(l1Count) as _, i}
          <div class="text-base">
            <label class="block text-sm text-gray-600 mb-1">
              Layer 1 neuron {i + 1} activation
            </label>
            <select class="px-2 py-1 border rounded text-sm" bind:value={uiL1Acts[i]}>
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">ReLU</option>
            </select>
          </div>
        {/each}
      </div>

      {#if l2Count === 1}
        <div class="flex flex-wrap items-end gap-3 mt-2">
          <div class="text-base">
            <label class="block text-sm text-gray-600 mb-1">
              Layer 2 neuron activation
            </label>
            <select class="px-2 py-1 border rounded text-sm" bind:value={uiL2Acts[0]}>
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">ReLU</option>
            </select>
          </div>

          <div class="text-base">
            <label class="block text-sm text-transparent mb-1">update</label>
            <button class="px-3 py-1 border rounded bg-gray-50 text-base" on:click={applyActsOnly}>
              Update
            </button>
          </div>
        </div>
      {:else}
        <div class="flex flex-wrap items-end gap-3 mt-2">
          {#each Array(l2Count) as _, k}
            <div class="text-base">
              <label class="block text-sm text-gray-600 mb-1">
                Layer 2 neuron {k + 1} activation
              </label>
              <select class="px-2 py-1 border rounded text-sm" bind:value={uiL2Acts[k]}>
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
              Output activation (after Σ of layer 2)
            </label>
            <select class="px-2 py-1 border rounded text-sm" bind:value={uiActivationOut}>
              <option value="sign">sign</option>
              <option value="step">step</option>
              <option value="tanh">tanh</option>
              <option value="sigmoid">sigmoid</option>
              <option value="relu">ReLU</option>
            </select>
          </div>

          <div class="text-base">
            <label class="block text-sm text-transparent mb-1">update</label>
            <button class="px-3 py-1 border rounded bg-gray-50 text-base" on:click={applyActsOnly}>
              Update
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </header>

  <div class="grid w-full" style="grid-template-columns: 1fr 1fr;">
    <section class="min-w-0 box-border border rounded border-l-0 p-0 overflow-hidden">
      <div class="h-full w-full min-h-[460px] flex flex-col">
        <div class="flex-1 min-h-[260px]">
          <svg viewBox="0 0 740 260" class="h-full w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 z" fill="#0f172a" />
              </marker>
              <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L8,4 L0,8 z" fill="#0f766e" />
              </marker>
            </defs>

            <circle cx={INPUT_X1} cy={INPUT_Y1} r="22" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x={INPUT_X1} y={INPUT_Y1 + 5} font-size="15" text-anchor="middle" fill="#0f172a">x₁</text>

            <circle cx={INPUT_X2} cy={INPUT_Y2} r="22" fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x={INPUT_X2} y={INPUT_Y2 + 5} font-size="15" text-anchor="middle" fill="#0f172a">x₂</text>

            <circle cx={INPUT_XB} cy={INPUT_YB} r="22" fill="#fef9c3" stroke="#f97316" stroke-width="1.2" />
            <text x={INPUT_XB} y={INPUT_YB + 5} font-size="15" text-anchor="middle" fill="#c2410c">b</text>

            {#each Array(l1Count) as _, i}
              <circle cx={L1_CX} cy={layerY(i, l1Count)} r={NEURON_R} fill="#dbeafe" stroke="#1d4ed8" stroke-width="1.6" />
              <text x={L1_CX} y={layerY(i, l1Count) + 4} font-size="11" text-anchor="middle" fill="#1d4ed8">L1-{i + 1}</text>

              <line x1={INPUT_X1 + 22} y1={INPUT_Y1} x2={inputEndX(L1_CX, layerY(i, l1Count), 0)} y2={inputEndY(L1_CX, layerY(i, l1Count), 0)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              <line x1={INPUT_X2 + 22} y1={INPUT_Y2} x2={inputEndX(L1_CX, layerY(i, l1Count), 1)} y2={inputEndY(L1_CX, layerY(i, l1Count), 1)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              <line x1={INPUT_XB + 22} y1={INPUT_YB} x2={inputEndX(L1_CX, layerY(i, l1Count), 2)} y2={inputEndY(L1_CX, layerY(i, l1Count), 2)} stroke="#f97316" stroke-width="1.1" marker-end="url(#arrow-green)" />

              <line x1={L1_CX + NEURON_R} y1={layerY(i, l1Count)} x2={l1ActX() - L1_ACT_R} y2={layerY(i, l1Count)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              <circle cx={l1ActX()} cy={layerY(i, l1Count)} r={L1_ACT_R} fill="#fef2f2" stroke="#f97316" stroke-width="1.2" />
              <text x={l1ActX()} y={layerY(i, l1Count) + 4} font-size="9" text-anchor="middle" fill="#b91c1c">{l1Neurons[i]?.act}</text>
            {/each}

            {#each Array(l2Count) as _, k}
              <circle cx={L2_CX} cy={layerY(k, l2Count)} r={NEURON_R} fill="#ecfdf3" stroke="#16a34a" stroke-width="1.6" />
              <text x={L2_CX} y={layerY(k, l2Count) + 4} font-size="11" text-anchor="middle" fill="#166534">L2-{k + 1}</text>

              {#if l2Count === 1}
                <line x1={L2_CX + NEURON_R} y1={layerY(k, l2Count)} x2={l2ActX() - L2_ACT_R} y2={layerY(k, l2Count)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
                <circle cx={l2ActX()} cy={layerY(k, l2Count)} r={L2_ACT_R} fill="#fef2f2" stroke="#f97316" stroke-width="1.2" />
                <text x={l2ActX()} y={layerY(k, l2Count) + 4} font-size="9" text-anchor="middle" fill="#b91c1c">{l2Neurons[k]?.act}</text>
                <line x1={l2ActX() + L2_ACT_R} y1={layerY(k, l2Count)} x2={OUT_CX - OUT_R} y2={OUT_CY} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              {:else}
                <line x1={L2_CX + NEURON_R} y1={layerY(k, l2Count)} x2={l2ActX() - L2_ACT_R} y2={layerY(k, l2Count)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
                <circle cx={l2ActX()} cy={layerY(k, l2Count)} r={L2_ACT_R} fill="#fef2f2" stroke="#f97316" stroke-width="1.2" />
                <text x={l2ActX()} y={layerY(k, l2Count) + 4} font-size="9" text-anchor="middle" fill="#b91c1c">{l2Neurons[k]?.act}</text>
                <line x1={l2ActX() + L2_ACT_R} y1={layerY(k, l2Count)} x2={sigma2EndX(k)} y2={sigma2EndY(k)} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              {/if}
            {/each}

            {#if l2Count > 1}
              <circle cx={SIGMA2_CX} cy={SIGMA2_CY} r={SIGMA2_R} fill="#e5e7eb" stroke="#0f172a" stroke-width="1.6" />
              <text x={SIGMA2_CX} y={SIGMA2_CY + 5} font-size="20" text-anchor="middle" fill="#0f172a">Σ</text>

              <line x1={SIGMA2_CX + SIGMA2_R} y1={SIGMA2_CY} x2={OUT_ACT_CX - OUT_ACT_R} y2={OUT_ACT_CY} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
              <circle cx={OUT_ACT_CX} cy={OUT_ACT_CY} r={OUT_ACT_R} fill="#ecfdf3" stroke="#16a34a" stroke-width="1.4" />
              <text x={OUT_ACT_CX} y={OUT_ACT_CY + 4} font-size="10" text-anchor="middle" fill="#166534">{activationOut}</text>

              <line x1={OUT_ACT_CX + OUT_ACT_R} y1={OUT_ACT_CY} x2={OUT_CX - OUT_R} y2={OUT_CY} stroke="#0f172a" stroke-width="1.2" marker-end="url(#arrow-head)" />
            {/if}

            {#each l2Idxs as k (`${l1Count}-${l2Count}-k${k}`)}
              {#each l1Idxs as j (`${l1Count}-${l2Count}-k${k}-j${j}`)}
                {@const s = l1L2Start(j, k)}
                {@const e = l1L2End(j, k)}
                <line
                  x1={s.x}
                  y1={s.y}
                  x2={e.x}
                  y2={e.y}
                  stroke="#0f172a"
                  stroke-width="1.1"
                  marker-end="url(#arrow-head)"
                />
              {/each}
            {/each}

            <circle cx={OUT_CX} cy={OUT_CY} r={OUT_R} fill="#ffffff" stroke="#0f172a" stroke-width="1.4" />
            <text x={OUT_CX} y={OUT_CY + 5} font-size="15" text-anchor="middle" fill="#0f172a">y</text>
          </svg>
        </div>

        <div class="border-t px-3 py-2 bg-gray-50 text-sm">
          <div class="font-medium mb-2">
            Weights for layer 1 and layer 2
            <span class="text-gray-600">
              (Layer 1: tᵢ = w₁ᶦ·x₁ + w₂ᶦ·x₂ + b, hᵢ = act₁ᶦ(tᵢ);
              Layer 2: sᵏ = Σᵢ vᵢᵏ·hᵢ + b, gᵏ = act₂ᵏ(sᵏ);
              if layer 2 has 1 neuron: y = g¹;
              else: y = act<span style="font-size: 0.8em;">out</span>(g¹ + g²))
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-2">
            <div class="w-24 font-semibold">Bias b</div>
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

          {#if l1Neurons.length > 0}
            <div class="font-semibold mb-1">Layer 1</div>
            {#each l1Neurons as neu, i}
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <div class="w-24 font-semibold">Neuron {i + 1}</div>

                <label class="flex items-center gap-1">
                  <span>{w1Label(i)}</span>
                  <input
                    type="number"
                    class="w-20 px-1 py-0.5 border rounded font-mono text-xs"
                    step="0.1"
                    value={neu.w1}
                    on:input={(e) => updateL1(i, 'w1', (e.target as HTMLInputElement).valueAsNumber)}
                  />
                </label>

                <label class="flex items-center gap-1">
                  <span>{w2Label(i)}</span>
                  <input
                    type="number"
                    class="w-20 px-1 py-0.5 border rounded font-mono text-xs"
                    step="0.1"
                    value={neu.w2}
                    on:input={(e) => updateL1(i, 'w2', (e.target as HTMLInputElement).valueAsNumber)}
                  />
                </label>
              </div>
            {/each}
          {/if}

          {#if l2Neurons.length > 0}
            <div class="font-semibold mt-3 mb-1">Layer 2</div>
            {#each l2Neurons as neu2, k}
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <div class="w-24 font-semibold">Neuron {k + 1}</div>

                {#each Array(l1Count) as _, j}
                  <label class="flex items-center gap-1 mb-1">
                    <span>{vLabel(j, k)}</span>
                    <input
                      type="number"
                      class="w-20 px-1 py-0.5 border rounded font-mono text-xs"
                      step="0.1"
                      value={neu2.ws[j]}
                      on:input={(e) =>
                        updateL2(k, j, (e.target as HTMLInputElement).valueAsNumber)
                      }
                    />
                  </label>
                {/each}
              </div>
            {/each}
          {/if}

          <div class="mt-2">
            <button
              class="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50"
              on:click={draw}
              disabled={!ready || l1Count === 0 || l2Count === 0}
            >
              Draw
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="min-w-0 box-border border rounded overflow-hidden relative">
      <div class="absolute inset-0 min-w-0 min-h-[460px] box-border" bind:this={el} />
    </section>
  </div>
</div>

<style>
  html, body { height: 100%; }
  body { margin: 0; overflow-y: auto; overflow-x: hidden; }
  :root { --sidebar-w: 72px; }
</style>
