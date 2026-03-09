<script lang="ts">
	import { chartBlue, chartGreen, chartPurple } from '$lib/colors';
	import type { BarChartData } from '$lib/types';
	import genBarChartData from '$lib/utils';
	import { scaleBand } from 'd3-scale';
	import { Axis, Chart, Svg, Highlight, Spline, Tooltip, Bars, Area } from 'layerchart';

	let { layers, value }: { layers: number; value: number } = $props();

	const data: BarChartData[] = $derived(genBarChartData(layers, value));
</script>

<!--
@component
Generates a 2d plot for the provided range and activation function

- Usage:
  ```svelte
<ActivationChart {data} />
  ```
-->

<div class="h-[400px] rounded-sm border p-4">
	<Chart
		{data}
		x="layer"
		xScale={scaleBand().padding(0)}
		y={['area', 'cumulativeArea']}
		yDomain={[0, null]}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />

				<Bars y="cumulativeArea" spacing={0} strokeWidth={1} rounded="all" class="fill-blue-500" />
				<Bars y="area" strokeWidth={1} class="fill-green-500" />
				<Spline y="cumulativeArea" class="stroke-purple-500 stroke-2" />
				<Area y1={(d) => d.cumulativeArea} class="fill-purple-500" fill-opacity={0.5} />
				<Highlight points lines />
			</Svg>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Data</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Layer Area: " value={data.area.toFixed(2)} color={chartGreen} />
						<Tooltip.Item
							label="Cumulative Area: "
							value={data.cumulativeArea.toFixed(2)}
							color={chartBlue}
						/>
						<Tooltip.Item
							label="(x, y) Intercept:"
							value={'(' + data.layer + ', ' + data.cumulativeArea.toFixed(2) + ')'}
							color={chartPurple}
						/>
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>

			<Tooltip.Root
				x="data"
				y={context.height + context.padding.top + 2}
				anchor="top"
				class="whitespace-nowrap rounded-sm border border-primary bg-surface-100 px-2 py-[2px] text-[10px] font-semibold text-primary"
			>
				{#snippet children({ data })}
					{data.layer}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
