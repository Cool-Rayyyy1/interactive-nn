<script lang="ts">
	import type { Input } from '$lib/types';
	import { Axis, Chart, Spline, Svg, Tooltip, Highlight } from 'layerchart';

	let { data = $bindable() }: { data: Input[] } = $props();
</script>

<!--
@component
Generates a 2d plot for the provided range and activation function

- Usage:
  ```svelte
<ActivationChart {data} />
  ```
-->
<div class="h-[300px] rounded border p-4">
	<Chart
		{data}
		x="input"
		y="output"
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" grid rule />
			<Spline class="stroke-primary stroke-2" tweened />
			<Highlight points lines />
		</Svg>

		<Tooltip.Root let:data>
			<Tooltip.Header>Coordinates</Tooltip.Header>
			<Tooltip.List>
				<Tooltip.Item label="(x, y): " value={'(' + data.input + ', ' + data.output + ')'} />
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
