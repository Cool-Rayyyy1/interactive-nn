<script lang="ts">
	import { Axis, Chart, Spline, Svg, Tooltip, Highlight } from 'layerchart';

	let { data }: { data: { input: number; output: number; derivative: number } } = $props();
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
		y={['output', 'derivative']}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" grid rule />
			<Spline class="stroke-primary stroke-2" motion="tween" />
			<Highlight points lines />
		</Svg>

		{#snippet marks()}
			<Spline y="output" class="stroke-primary" />
			<Spline y="derivative" class="stroke-secondary" />
		{/snippet}

		<Tooltip.Root>
			{#snippet children({ data })}
				<Tooltip.Header>Coordinates</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item label="(x, y): " value={'(' + data.input + ', ' + data.output + ')'} />
				</Tooltip.List>
			{/snippet}
		</Tooltip.Root>
	</Chart>
</div>
