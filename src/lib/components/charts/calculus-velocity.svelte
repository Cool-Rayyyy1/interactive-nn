<script lang="ts">
	import { chartBlue, chartGreen } from '$lib/colors';
	import { range } from '$lib/utils';
	import { Axis, Chart, Svg, Highlight, Spline, Tooltip, Legend } from 'layerchart';

	interface Data {
		time: number;
		distance: number;
		velocity: number;
	}

	const time = range(0, 1, 0.1);
	let distance: number = 0;
	const data: Data[] = time.map((t): Data => {
		const velocity = Math.exp(t);
		const ldistance = t * velocity;
		distance += ldistance;
		return <Data>{
			time: t,
			distance,
			velocity
		};
	});
</script>

<div class="h-[400px] rounded-sm border p-4">
	<Chart
		{data}
		x="time"
		y={['distance', 'velocity']}
		yNice
		padding={{ left: 16, bottom: 24 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" grid rule />

				<Spline y="velocity" class="stroke-green-500 stroke-2" />
				<Spline y="distance" class="stroke-blue-500 stroke-2" />
				<Highlight points lines />
			</Svg>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Data</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item
							label="Velocity: "
							value={data.velocity.toFixed(2) + ' m/s'}
							color={chartGreen}
						/>
						<Tooltip.Item
							label="Distance: "
							value={data.distance.toFixed(2) + ' m'}
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
					{data.time}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
