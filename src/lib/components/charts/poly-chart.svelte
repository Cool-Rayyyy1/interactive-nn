<script lang="ts">
	import { Legend, LineChart, Spline, Tooltip } from 'layerchart';

	let {
		coefficient = $bindable(),
		range,
		yMin,
		yMax,
		exp
	}: { coefficient: number; range: number[]; yMin: number; yMax: number; exp: number } = $props();

	interface Data {
		x: number;
		y: number;
	}

	const data: Data[] = $derived(
		range.map(
			(val): Data =>
				<Data>{
					x: val,
					y: coefficient * val ** exp
				}
		)
	);
</script>

<div class="h-[300px] w-full rounded-sm border border-blue-400 p-2">
	<LineChart
		{data}
		x="x"
		y="y"
		yDomain={[yMin, yMax]}
		padding={{ top: 0, right: 0, bottom: 40, left: 70 }}
	>
		{#snippet spline()}
			<Spline class="stroke-blue-400 stroke-2" />
		{/snippet}

		{#snippet legend()}
			<Legend
				placement="bottom"
				title="x"
				height={-50}
				width={20}
				classes={{ title: 'font-bold text-2xl text-blue-400' }}
			/>
			<Legend
				title="f(x)"
				placement="left"
				width={-20}
				height={-50}
				classes={{ title: 'font-bold text-lg text-blue-400' }}
			/>
		{/snippet}

		{#snippet tooltip({ context })}
			<Tooltip.Root
				x={context.padding.left}
				y="data"
				anchor="right"
				contained={false}
				class="mr-[2px] whitespace-nowrap rounded-sm border border-primary bg-surface-100 px-1 py-[2px] text-[10px] font-semibold text-primary"
			>
				{#snippet children({ data })}
					{context.y(data).toFixed(2)}
				{/snippet}
			</Tooltip.Root>

			<Tooltip.Root
				x="data"
				y={context.height}
				anchor="top"
				class="mt-[1px] whitespace-nowrap rounded-sm border border-primary bg-surface-100 px-2 py-[1px] text-[10px] font-semibold text-primary"
				contained={false}
			>
				{#snippet children({ data })}
					{context.x(data).toFixed(2)}
				{/snippet}
			</Tooltip.Root>

			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>Response</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="x" value={data.x.toFixed(2)} />
						<Tooltip.Item label="f(x)" value={data.y.toFixed(2)} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</LineChart>
</div>
