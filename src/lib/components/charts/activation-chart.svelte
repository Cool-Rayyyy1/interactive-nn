<script lang="ts">
	import type { SeriesData } from '$lib/types';
	import { Axis, Chart, Svg, Highlight, Spline, Tooltip } from 'layerchart';

	let { data }: { data: SeriesData[] } = $props();

	const keys = ['activation', 'derivative'];
</script>

<!--
@component
Generates a 2d plot for the provided range and activation function

- Usage:
  ```svelte
<ActivationChart {data} />
  ```
-->

<div class="h-[300px] rounded-sm border p-4">
	<Chart
		{data}
		x="input"
		y={keys}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" rule />

			<Spline y="activation" class="stroke-green-500" />
			<Spline y="derivative" class="stroke-blue-500" />

			<Highlight points lines />
		</Svg>

		<Tooltip.Root>
			{#snippet children({ data })}
				<Tooltip.Header>Data</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item
						label="Activation"
						value={data.activation}
						color="oklch(72.3% 0.219 149.579)"
					/>
					<Tooltip.Item
						label="derivative"
						value={data.derivative}
						color="oklch(62.3% 0.214 259.815)"
					/>
				</Tooltip.List>
			{/snippet}
		</Tooltip.Root>
	</Chart>
</div>
