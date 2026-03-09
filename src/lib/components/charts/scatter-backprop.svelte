<script lang="ts">
	import { Legend, ScatterChart, Tooltip } from 'layerchart';

	let {
		k_0 = $bindable(),
		k_1 = $bindable(),
		k_2 = $bindable(),
		k_3 = $bindable(),
		range,
		yMin,
		yMax,
		noise
	}: {
		k_0: number;
		k_1: number;
		k_2: number;
		k_3: number;
		range: number[];
		yMin: number;
		yMax: number;
		noise: boolean;
	} = $props();

	interface Data {
		x: number;
		y: number;
	}

	const on = noise == true ? 1 : 0;

	function polynomial(x: number, k_0: number, k_1: number, k_2: number, k_3: number): number {
		return k_0 + k_1 * x + k_2 * x ** 2 + k_3 * x ** 3;
	}

	const data: Data[] = $derived(
		range.map((val): Data => {
			const x = val;
			const y = polynomial(x, k_0, k_1, k_2, k_3);
			const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
			const noise = (Math.random() / 10) * plusOrMinus * Math.floor(yMax / 2) * on;
			return <Data>{
				x,
				y: y + noise
			};
		})
	);
</script>

<div class="h-[400px] rounded-sm border border-blue-400 p-4">
	<ScatterChart
		{data}
		x="x"
		y="y"
		padding={{ top: 0, right: 0, bottom: 50, left: 50 }}
		yDomain={[yMin, yMax]}
	>
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
					{context.x(data)}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</ScatterChart>
</div>
