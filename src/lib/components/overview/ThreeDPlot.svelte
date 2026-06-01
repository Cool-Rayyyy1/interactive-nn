<script lang="ts">
  import type { ONeuron, Layer2Neuron } from '$lib/types';
  import { evaluateNetwork } from "$lib/math/overview-math";
  import { Rotate3d } from "lucide-svelte";

 interface Props {
  neurons: ONeuron[];
  bias: number;
  outputActivation: string;
  layerCount?: number;
  layer2Neurons?: Layer2Neuron[];
  bias2?: number;
}

let {
  neurons = [],
  bias = 0,
  outputActivation = "tanh",
  layerCount = 1,
  layer2Neurons = [],
  bias2 = 0
}: Props = $props();

    // 3D parameters: Yaw/Pitch angles & Zoom
  let yaw = $state(-0.6); // Horizontal rotation
  let pitch = $state(0.5); // Vertical tilt
  let zoom = $state(45); // Plot base scaling (increased default zoom)
  let isDragging = $state(false);
  let canRotate = $state(true); // Support native scroll when turned off
  
  let dragStartPos = { x: 0, y: 0 };
  let dragStartAngles = { yaw: 0, pitch: 0 };

  let dims = $state({ width: 380, height: 320 });

  // Responsive Zoom: automatically scales the plot up on larger screens to utilize all canvas space
  let effectiveZoom = $derived(
    zoom * Math.min(1.5, Math.max(0.75, Math.min(dims.width / 360, dims.height / 300)))
  );

  let canvasRef: HTMLCanvasElement | null = $state(null);
  let containerRef: HTMLDivElement | null = $state(null);

  // Handle ResizeObserver to resize canvas naturally
  $effect(() => {
    if (!containerRef) return;
    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      dims = {
        width: Math.max(width, 280),
        height: Math.max(height, 280),
      };
    });
    observer.observe(containerRef);
    return () => observer.disconnect();
  });

  // Main drawing routine triggered whenever variables change (reactive $effect)
  $effect(() => {
    const canvas = canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear Canvas
    ctx.clearRect(0, 0, dims.width, dims.height);

    const centerX = dims.width / 2;
    const centerY = dims.height / 2 + 15; // Slightly lower center for elevation offset

    // Define Grid points [-5, 5]
    const gridRes = 18; // 18x18 mesh (perfect density / performance)
    const minVal = -5;
    const maxVal = 5;
    const step = (maxVal - minVal) / gridRes;

    interface Vertex {
      x3d: number; // grid x1 (-5 to 5)
      y3d: number; // grid x2 (-5 to 5)
      z3d: number; // grid output
      label: number; // raw value for color mapping
      px: number; // projected 2D screen x
      py: number; // projected 2D screen y
      depth: number; // transformed Z (for depth sorting)
    }

    const vertices: Vertex[][] = [];

    for (let r = 0; r <= gridRes; r++) {
      const y3d = minVal + r * step; // grid row (representing x2)
      vertices[r] = [];
      for (let c = 0; c <= gridRes; c++) {
        const x3d = minVal + c * step; // grid col (representing x1)

        // Evaluate network output at (x1 = x3d, x2 = y3d)
        const output = evaluateNetwork(x3d, y3d, neurons, bias, outputActivation as any, layerCount, layer2Neurons, bias2);
        
        // Scale and shift Z for neat visual proportion (-2.5 to 2.5)
        const zScale = 2.5; 
        const z3d = output * zScale; 

        // Cos and Sin values
        const cosY = Math.cos(yaw);
        const sinY = Math.sin(yaw);
        const cosP = Math.cos(pitch);
        const sinP = Math.sin(pitch);

        // 1. Rotate around Z (yaw)
        const xRot1 = x3d * cosY - y3d * sinY;
        const yRot1 = x3d * sinY + y3d * cosY;

        // 2. Rotate around X (pitch)
        const yRot2 = yRot1 * cosP + z3d * sinP;
        const zRot2 = -yRot1 * sinP + z3d * cosP;

        // Perspective Division factor or Isometric representation
        const cameraDist = 18;
        const pScale = cameraDist / (cameraDist + zRot2);

        vertices[r][c] = {
          x3d,
          y3d,
          z3d,
          label: output,
          px: centerX + xRot1 * effectiveZoom * pScale,
          py: centerY - yRot2 * effectiveZoom * pScale,
          depth: zRot2,
        };
      }
    }

    // 2. Define grid faces (quads) for Depth Sorting
    interface Face {
      rIndex: number;
      cIndex: number;
      avgDepth: number;
    }

    const faces: Face[] = [];
    for (let r = 0; r < gridRes; r++) {
      for (let c = 0; c < gridRes; c++) {
        const d1 = vertices[r][c].depth;
        const d2 = vertices[r + 1][c].depth;
        const d3 = vertices[r][c + 1].depth;
        const d4 = vertices[r + 1][c + 1].depth;
        faces.push({
          rIndex: r,
          cIndex: c,
          avgDepth: (d1 + d2 + d3 + d4) / 4,
        });
      }
    }

    // Sort faces (Painter's algorithm)
    faces.sort((a, b) => b.avgDepth - a.avgDepth);

    // Color conversion helper based on output values
    const getColorForValue = (val: number) => {
      let checkedVal = typeof val === "number" && !isNaN(val) ? val : 0;
      let normalized = (checkedVal + 1) / 2; // default mapping for tanh/sign (-1 to 1)
      if (outputActivation === "step" || outputActivation === "sigmoid") {
        normalized = checkedVal; // step/sigmoid already 0 to 1
      } else if (outputActivation === "relu") {
        normalized = Math.min(1, checkedVal / 4); // relu can grow large
      }
      if (isNaN(normalized)) {
        normalized = 0.5;
      }
      normalized = Math.max(0, Math.min(1, normalized));

      // Interpolate from slate (#E4E3E0) to safety orange (#F27D26)
      const red = Math.round(228 * (1 - normalized) + 242 * normalized);
      const green = Math.round(227 * (1 - normalized) + 125 * normalized);
      const blue = Math.round(224 * (1 - normalized) + 38 * normalized);
      const opacity = 0.85;

      return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    };

    // 3. Draw Axis Guideline cage under the surface
    const drawGridFloor = () => {
      ctx.strokeStyle = "rgba(20, 20, 20, 0.08)";
      ctx.lineWidth = 1;

      const draw3DLine = (xSource: number, ySource: number, zSource: number, xDest: number, yDest: number, zDest: number) => {
        const project = (x: number, y: number, z: number) => {
          const cosY = Math.cos(yaw);
          const sinY = Math.sin(yaw);
          const cosP = Math.cos(pitch);
          const sinP = Math.sin(pitch);
          const xRot1 = x * cosY - y * sinY;
          const yRot1 = x * sinY + y * cosY;
          const yRot2 = yRot1 * cosP + z * sinP;
          const zRot2 = -yRot1 * sinP + z * cosP;
          const pScale = 18 / (18 + zRot2);
          return { px: centerX + xRot1 * effectiveZoom * pScale, py: centerY - yRot2 * effectiveZoom * pScale };
        };

        const start = project(xSource, ySource, zSource);
        const end = project(xDest, yDest, zDest);

        ctx.beginPath();
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();
      };

      const bounds = [-5, 5];
      for (const edge of bounds) {
        draw3DLine(edge, -5, 0, edge, 5, 0);
        draw3DLine(-5, edge, 0, 5, edge, 0);
      }

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(20, 20, 20, 0.35)";
      draw3DLine(-5.5, 0, 0, 5.5, 0, 0);
      draw3DLine(0, -5.5, 0, 0, 5.5, 0);

      ctx.strokeStyle = "#F27D26";
      draw3DLine(0, 0, -3.0, 0, 0, 3.0);
    };

    drawGridFloor();

    // 4. Render Grid Faces
    faces.forEach((face) => {
      const { rIndex: r, cIndex: c } = face;

      const p00 = vertices[r][c];
      const p10 = vertices[r + 1][c];
      const p11 = vertices[r + 1][c + 1];
      const p01 = vertices[r][c + 1];

      ctx.beginPath();
      ctx.moveTo(p00.px, p00.py);
      ctx.lineTo(p10.px, p10.py);
      ctx.lineTo(p11.px, p11.py);
      ctx.lineTo(p01.px, p01.py);
      ctx.closePath();

      const avgVal = (p00.label + p10.label + p11.label + p01.label) / 4;
      ctx.fillStyle = getColorForValue(avgVal);
      ctx.fill();

      ctx.strokeStyle = "rgba(20, 20, 20, 0.16)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // 5. Draw labels
    const drawLabel3D = (text: string, x: number, y: number, z: number, color: string) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const xRot1 = x * cosY - y * sinY;
      const yRot1 = x * sinY + y * cosY;
      const yRot2 = yRot1 * cosP + z * sinP;
      const zRot2 = -yRot1 * sinP + z * cosP;
      const pScale = 18 / (18 + zRot2);

      const px = centerX + xRot1 * effectiveZoom * pScale;
      const py = centerY - yRot2 * effectiveZoom * pScale;

      ctx.fillStyle = color;
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, px, py);
    };

    drawLabel3D("x₁ [+5]", 5.8, 0, 0, "#141414");
    drawLabel3D("x₁ [-5]", -5.8, 0, 0, "#141414");
    drawLabel3D("x₂ [+5]", 0, 5.8, 0, "#141414");
    drawLabel3D("x₂ [-5]", 0, -5.8, 0, "#141414");
    drawLabel3D("y [+]", 0, 0, 3.2, "#F27D26");
    drawLabel3D("y [-]", 0, 0, -3.2, "#F27D26");
  });

  // Event Handlers for rotation / zoom
  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    dragStartPos = { x: e.clientX, y: e.clientY };
    dragStartAngles = { yaw, pitch };
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    const sensitivity = 0.007;
    yaw = dragStartAngles.yaw + dx * sensitivity;
    pitch = dragStartAngles.pitch + dy * sensitivity;
  }

  function handleMouseUpOrLeave() {
    isDragging = false;
  }

  function handleTouchStart(e: TouchEvent) {
    if (!canRotate) return;
    if (e.touches.length === 1) {
      isDragging = true;
      dragStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragStartAngles = { yaw, pitch };
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (!canRotate || !isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartPos.x;
    const dy = e.touches[0].clientY - dragStartPos.y;
    const sensitivity = 0.007;
    yaw = dragStartAngles.yaw + dx * sensitivity;
    pitch = dragStartAngles.pitch + dy * sensitivity;

    if (e.cancelable) {
      e.preventDefault();
    }
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  function resetView() {
    yaw = -0.6;
    pitch = 0.5;
    zoom = 45;
  }
</script>

<div class="relative flex flex-col justify-between items-stretch grow bg-white rounded-none p-0 group select-none overflow-hidden text-[#141414]">
  <div class="absolute top-0 left-0 z-10 pointer-events-none">
    <span class="flex items-center gap-1.5 text-[10px] font-bold text-[#141414] uppercase tracking-widest bg-[#E4E3E0] px-3 py-1.5 border border-[#141414] shadow-[2px_2px_0px_#141414] font-mono">
      <Rotate3d class="w-3.5 h-3.5 text-[#F27D26]" /> 3D SURFACE PLOT
    </span>
  </div>

  <div class="absolute top-0 right-0 z-10 flex gap-1.5">
    <button
      onclick={() => canRotate = !canRotate}
      class="text-[9.5px] font-mono hover:bg-[#F27D26] hover:text-[#141414] px-2.5 py-1.5 border border-[#141414] font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#141414] transition active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none {
        canRotate ? 'bg-[#141414] text-white' : 'bg-white text-[#141414] opacity-90'
      }"
      title="Toggle Drag Rotation. Turn off to allow native scrolling when dragging over this plot."
    >
      {canRotate ? "Orbit Mode [On]" : "Touch Scroll [Off]"}
    </button>
    <button
      onclick={resetView}
      class="text-[9.5px] text-[#141414] font-mono hover:bg-[#F27D26] hover:text-[#141414] px-2.5 py-1.5 bg-white border border-[#141414] font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#141414] transition active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none"
      title="Reset View Rotation"
    >
      Reset View
    </button>
  </div>

  <!-- Actual Drawing Canvas -->
  <div
    bind:this={containerRef}
    class="flex-1 w-full min-h-[260px] flex items-center justify-center relative overflow-hidden bg-[#E4E3E0]/20 border border-[#141414]/30 mt-8 mb-1"
    style="cursor: {canRotate ? 'move' : 'default'};"
  >
    <canvas
      bind:this={canvasRef}
      width={dims.width}
      height={dims.height}
      onmousedown={handleMouseDown}
      onmousemove={handleMouseMove}
      onmouseup={handleMouseUpOrLeave}
      onmouseleave={handleMouseUpOrLeave}
      ontouchstart={handleTouchStart}
      ontouchmove={handleTouchMove}
      ontouchend={handleTouchEnd}
      class="touch-none select-none block"
      style="touch-action: {canRotate ? 'none' : 'auto'};"
    ></canvas>
    {#if isDragging}
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-[9px] text-[#141414] px-3 py-1 font-mono uppercase font-bold border border-[#141414] shadow-[2px_2px_0px_#141414] pointer-events-none">
        Yaw: {yaw.toFixed(2)}r | Pitch: {pitch.toFixed(2)}r
      </div>
    {/if}
  </div>

  <!-- Zoom / Scaling Slider Control -->
  <div class="pt-3 border-t border-[#141414]/30 flex items-center justify-between gap-3 text-[#141414]/80 text-xs text-sans">
    <span class="text-[10px] font-mono uppercase font-black whitespace-nowrap tracking-wider">Perspective Scale</span>
    <input
      type="range"
      min="20"
      max="90"
      bind:value={zoom}
      class="w-full h-2 bg-[#E4E3E0] border border-[#141414] appearance-none cursor-ew-resize accent-[#F27D26] outline-none"
    />
    <span class="text-[10px] font-mono text-[#141414] font-bold bg-[#E4E3E0] px-1.5 py-0.5 border border-[#141414]">{effectiveZoom.toFixed(0)}px</span>
  </div>
</div>