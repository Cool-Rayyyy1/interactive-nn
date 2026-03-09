<script lang="ts">
	import * as ShadChart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { SeriesData } from '$lib/types';
	import { Axis, Chart, Layer, Highlight, Spline, Tooltip, Grid, Rule, Frame } from 'layerchart';

	let { data, showDx, keys }: { data: SeriesData[]; showDx: boolean; keys: string[] } = $props();

	const chartConfig = {
		desktop: {
			label: 'Desktop',
			color: '#2563eb'
		},
		mobile: {
			label: 'Mobile',
			color: '#60a5fa'
		}
	} satisfies ShadChart.ChartConfig;
</script>

<!--
@component
Generates a 2d plot for the provided range and activation function

- Usage:
  ```svelte
<ActivationChart {data} />
  ```
-->
<Card.Root>
	<ShadChart.Container config={chartConfig} class="min-h-[300px] w-full p-5">
		<Chart
			{data}
			x="input"
			y={keys}
			yNice
			padding={{ left: 16, bottom: 24 }}
			tooltip={{ mode: 'bisect-x' }}
		>
			{#snippet children({ context })}
				<Layer type="svg">
					<Frame class="fill-slate-50" />
					<Axis placement="left" format="none" rule />
					<Axis placement="bottom" format="none" rule />

					<Spline y="activation" class="stroke-green-500" motion="tween" />
					{#if showDx}
						<Spline y="derivative" class="stroke-blue-500" motion="tween" />
					{/if}
					<Grid x y />
					<Rule x y />
					<Highlight points lines />
				</Layer>

				<Tooltip.Root>
					{#snippet children({ data })}
						<Tooltip.Header>Response</Tooltip.Header>
						<Tooltip.List>
							<Tooltip.Item
								label="f(x)"
								value={data.activation}
								color="oklch(72.3% 0.219 149.579)"
							/>
							{#if showDx}
								<Tooltip.Item
									label="f'(x)"
									value={data.derivative}
									color="oklch(62.3% 0.214 259.815)"
								/>
							{/if}
						</Tooltip.List>
					{/snippet}
				</Tooltip.Root>

				<Tooltip.Root
					x="data"
					y={context.height + context.padding.top + 2}
					anchor="top"
					class="border-primary bg-surface-100 text-primary rounded-sm border px-2 py-[2px] text-[10px] font-semibold whitespace-nowrap"
				>
					{#snippet children({ data })}
						{data.input}
					{/snippet}
				</Tooltip.Root>
			{/snippet}
		</Chart>
	</ShadChart.Container>
</Card.Root>
