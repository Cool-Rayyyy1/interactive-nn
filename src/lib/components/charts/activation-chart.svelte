<script lang="ts">
	import type { SeriesData } from '$lib/types';
	import { scaleOrdinal } from 'd3-scale';
	import { Axis, Chart, Svg, Tooltip, Highlight, Area } from 'layerchart';
	import { flatGroup } from 'd3-array';

	let { data }: { data: SeriesData[] } = $props();

	const dataByKey = flatGroup(data, (d) => d.key);

	const dataColors = {
		activation: 'oklch(69.6% 0.17 162.48)',
		derivative: 'oklch(54.6% 0.245 262.881)'
	};
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
		c="key"
		cScale={scaleOrdinal()}
		cDomain={Object.keys(dataColors)}
		cRange={Object.values(dataColors)}
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'voronoi' }}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" grid rule />
				{#each dataByKey as [key, data]}
					{@const color = context.cScale?.(key)}
					<Area {data} fill={color} fillOpacity={0.3} line={{ class: 'stroke-2', stroke: color }} />
				{/each}
				<Highlight points lines />
			</Svg>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Coordinates</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="(x, y): " value={'(' + data.input + ', ' + data.output + ')'} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
