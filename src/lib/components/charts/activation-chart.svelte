<script lang="ts">
	import type { SeriesData } from '$lib/types';
	import { Axis, Chart, Svg, Highlight, Spline, Tooltip } from 'layerchart';

	let { data, showDx, keys }: { data: SeriesData[]; showDx: boolean; keys: string[] } = $props();
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
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />

				<Spline y="activation" class="stroke-green-500" motion="tween" />
				{#if showDx}
					<Spline y="derivative" class="stroke-blue-500" motion="tween" />
				{/if}

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
						{#if showDx}
							<Tooltip.Item
								label="derivative"
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
				class="whitespace-nowrap rounded-sm border border-primary bg-surface-100 px-2 py-[2px] text-[10px] font-semibold text-primary"
			>
				{#snippet children({ data })}
					{data.input}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
