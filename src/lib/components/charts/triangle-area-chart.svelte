<script lang="ts">
	import { chartBlue, chartGreen, chartPurple } from '$lib/colors';
	import { range } from '$lib/utils';
	import { Axis, Chart, Svg, Highlight, Tooltip, Area } from 'layerchart';

	interface Data {
		radius: number;
		circumference: number;
		area: number;
	}

	const inputs = range(0, 11, 1);
	const data: Data[] = inputs.map((input): Data => {
		return <Data>{
			radius: input,
			circumference: input * 2 * Math.PI,
			area: input ** 2 * Math.PI
		};
	});
</script>

<div class="h-[400px] rounded-sm border p-4">
	<Chart
		{data}
		x="radius"
		y={'circumference'}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />

				<Area y1={(d) => d.circumference} class="fill-green-500" fill-opacity={0.9} />
				<Highlight points lines />
			</Svg>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Data</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Radius: " value={data.radius.toFixed(2)} color={chartGreen} />
						<Tooltip.Item
							label="Circumference: "
							value={data.circumference.toFixed(2)}
							color={chartBlue}
						/>
						<Tooltip.Item label="Area: " value={data.area.toFixed(2)} color={chartPurple} />
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
					{data.radius}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
