<script lang="ts">
	import { chartBlue, chartGreen, chartSlate } from '$lib/colors';
	import type { BarChartData } from '$lib/types';
	import genBarChartData from '$lib/utils';
	import { scaleBand } from 'd3-scale';
	import { BarChart, Tooltip } from 'layerchart';

	let { layers, value }: { layers: number; value: number } = $props();

	const data: BarChartData[] = $derived(genBarChartData(layers, value));

	const colors = [chartGreen];
</script>

<div class="h-[400px] rounded-sm border p-4">
	<BarChart
		{data}
		x="layer"
		xScale={scaleBand().padding(0)}
		series={[
			{
				key: 'cumulativeArea',
				color: chartBlue
			},
			{
				key: 'area'
			}
		]}
		z="area"
		r="cumulativeArea"
		c="layer"
		cRange={colors}
		props={{ bars: { rounded: 'none' } }}
	>
		{#snippet tooltip({ context })}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Data</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Layer: " value={context.x(data)} color={chartSlate} />
						<Tooltip.Item
							label="Layer Area: "
							value={context.z(data).toFixed(2)}
							color={chartGreen}
						/>
						<Tooltip.Item
							label="Cumulative Area: "
							value={context.r(data).toFixed(2)}
							color={chartBlue}
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
	</BarChart>
</div>
