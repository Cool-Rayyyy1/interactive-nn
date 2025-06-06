<script lang="ts">
	import { range } from 'd3-array';
	import { Legend, ScatterChart, Tooltip } from 'layerchart';

	let k_0 = 100;
	let k_1 = -30;
	let k_2 = 50;
	let k_3 = 25;
	let k_4 = -8;
	let k_5 = -1;
	let dataRange = range(-3, 3.25, 0.25);
	let yMin = -500;
	let yMax = 500;
	let noise = true;

	interface Data {
		x: number;
		y: number;
	}

	const on = noise == true ? 1 : 0;

	const noiseData: number[] = dataRange.map(() => {
		const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		return (Math.random() / 10) * plusOrMinus * Math.floor(yMax / 2) * on;
	});

	function polynomial(
		x: number,
		k_0: number,
		k_1: number,
		k_2: number,
		k_3: number,
		k_4: number,
		k_5: number
	): number {
		return k_0 + k_1 * x + k_2 * x ** 2 + k_3 * x ** 3 + k_4 * x ** 4 + k_5 * x ** 5;
	}

	const data: Data[] = $derived(
		dataRange.map((val, i): Data => {
			const x = val;
			const y = polynomial(x, k_0, k_1, k_2, k_3, k_4, k_5);
			return <Data>{
				x,
				y: y + noiseData[i]
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
