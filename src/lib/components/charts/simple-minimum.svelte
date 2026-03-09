<script lang="ts">
	import { range } from '$lib/utils';
	import { Axis, Chart, Spline, Svg, Tooltip, Highlight } from 'layerchart';

	interface Data {
		x: number;
		y: number;
	}

	const inputs = range(0, 10, 0.01);

	const data: Data[] = inputs.map(
		(val): Data =>
			<Data>{
				x: val,
				y: (val - 5) ** 2 + 1
			}
	);
</script>

<div class="h-[300px] rounded-sm border p-4">
	<Chart
		{data}
		x="x"
		y="y"
		yDomain={[0, null]}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" rule />
			<Spline class="stroke-primary stroke-2" />
			<Highlight points lines />
		</Svg>

		<Tooltip.Root anchor="top-left" x="data" xOffset={10} y="data" yOffset={10} contained={false}>
			{#snippet children({ data })}
				<Tooltip.Header>Response</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item label="f(x)" value={data.x} />
					<Tooltip.Item label="f'(x)" value={data.y.toFixed(2)} />
				</Tooltip.List>
			{/snippet}
		</Tooltip.Root>
	</Chart>
</div>
