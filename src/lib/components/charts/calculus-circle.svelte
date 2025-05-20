<script lang="ts">
	import type { BarChartData } from '$lib/types';
	import genBarChartData from '$lib/utils';
	import { BarChart, Tooltip } from 'layerchart';

	let { layers, value }: { layers: number; value: number } = $props();

	const data: BarChartData[] = $derived(genBarChartData(layers, value));
</script>

<div class="h-[400px] rounded-sm border p-6">
	<BarChart
		{data}
		x="value"
		y="layer"
		yRange={({ height }) => [height / 250, height / 2]}
		c="layer"
		cRange={['oklch(72.3% 0.219 149.579)', 'oklch(82.3% 0.219 149.579)']}
		radial
		orientation="horizontal"
		z="area"
		r="cumulativeArea"
	>
		{#snippet tooltip({ context })}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Data</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Layer: " value={context.y(data)} />
						<Tooltip.Item label="Radius: " value={context.x(data) * context.y(data)} />
						<Tooltip.Item label="Layer Area: " value={context.z(data).toFixed(2)} />
						<Tooltip.Item label="Cumulative Area: " value={context.r(data).toFixed(2)} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</BarChart>
</div>
