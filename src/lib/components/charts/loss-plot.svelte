<script lang="ts">
	import { Axis, Chart, Points, Svg, Tooltip, Highlight, Legend, AnnotationLine } from 'layerchart';
	let {
		data = $bindable(),
		showDerivative
	}: {
		data: Data[];
		showDerivative: boolean;
	} = $props();

	interface Data {
		x: number;
		y: number;
		x_prime: number;
		y_prime: number;
	}

	function point(m: number, x: number, b: number): number {
		return m * x + b;
	}
</script>

<div class="h-[400px] rounded-sm border border-blue-400 p-2">
	<Chart
		{data}
		x="x"
		y="y"
		padding={{ left: 75, bottom: 50 }}
		tooltip={{ mode: 'bisect-x' }}
		xDomain={[-10, 10]}
		yDomain={[0, 600]}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" grid rule />
				<Axis placement="bottom" rule />
				<Points class="fill-blue-400/40 stroke-green-400" />
				<Highlight points lines />

				{#if showDerivative}
					{#each data as item}
						{@const d = (item.y_prime - item.y) / (item.x_prime - item.x)}
						{@const b = item.y - d * item.x}
						{@const x1 = context.xScale?.(item.x - 1)}
						{@const y1 = context.yScale?.(point(d, item.x - 1, b))}
						{@const x2 = context.xScale?.(item.x + 1)}
						{@const y2 = context.yScale?.(point(d, item.x + 1, b))}
						<AnnotationLine
							r={6}
							props={{
								line: {
									x1: x1,
									y1: y1,
									x2: x2,
									y2: y2,
									class: '[stroke-dasharray:4,4] stroke-red-400 opacity-70'
								}
							}}
						/>
					{/each}
				{/if}
			</Svg>

			<Legend
				placement="bottom-right"
				title="k"
				height={-50}
				width={350}
				classes={{ title: 'text-2xl font-bold text-blue-400' }}
				orientation="vertical"
			/>

			<Legend
				placement="left"
				title="Loss"
				height={50}
				width={-350}
				classes={{ title: 'text-2xl font-bold text-blue-400 -rotate-90' }}
			/>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Response</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="k" value={data.x} />
						<Tooltip.Item label="Loss" value={data.y.toFixed(2)} />
						{#if showDerivative}
							{@const d = (data.y_prime - data.y) / (data.x_prime - data.x)}
							<Tooltip.Item label="k'" value={d.toFixed(2)} />
						{/if}
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
