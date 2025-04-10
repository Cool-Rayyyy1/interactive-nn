<script lang="ts">
	import type { ActivationFunction, Coords2d } from '$lib/types';
	import { activate, range } from '$lib/utils';
	import { Axis, Chart, Spline, Svg, Tooltip, Highlight } from 'layerchart';

	let {
		start,
		end,
		step,
		activation
	}: { start: number; end: number; step: number; activation: ActivationFunction } = $props();

	const inputRange = range(start, end, step);

	let data: Coords2d[] = inputRange.map((val): Coords2d => {
		return {
			x: val,
			y: +activate(activation, val).toFixed(4)
		};
	});
</script>

<!--
@component
Generates a 2d plot for the provided range and activation function

- Usage:
  ```svelte
<ActivationChart start={-5} end={5} step={0.01} activation={ActivationFunction.Step} />
  ```
-->
<div class="h-[300px] rounded border p-4">
	<Chart {data} x="x" y="y" yNice padding={{ left: 16, bottom: 24 }} tooltip={{ mode: 'bisect-x' }}>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" grid rule />
			<Spline class="stroke-primary stroke-2" />
			<Highlight points lines />
		</Svg>

		<Tooltip.Root let:data>
			<Tooltip.Header>Coordinates</Tooltip.Header>
			<Tooltip.List>
				<Tooltip.Item label="(x, y): " value={'(' + data.x + ', ' + data.y + ')'} />
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
