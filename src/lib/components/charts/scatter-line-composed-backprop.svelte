<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { Axis, Chart, Points, Spline, Svg } from 'layerchart';

	let {
		k_0 = $bindable(),
		k_1 = $bindable(),
		k_2 = $bindable(),
		k_3 = $bindable(),
		dataRange: dataRange,
		yMin,
		yMax,
		noise
	}: {
		k_0: number;
		k_1: number;
		k_2: number;
		k_3: number;
		dataRange: number[];
		yMin: number;
		yMax: number;
		noise: boolean;
	} = $props();

	interface Data {
		x: number;
		y: number;
		line: number;
	}

	const on = noise == true ? 1 : 0;

	function polynomial(x: number, k_0: number, k_1: number, k_2: number, k_3: number): number {
		return k_0 + k_1 * x + k_2 * x ** 2 + k_3 * x ** 3;
	}

	const data: Data[] = $derived(
		dataRange.map((val): Data => {
			const x = val;
			const y = polynomial(x, k_0, k_1, k_2, k_3);
			const line = polynomial(x, 3, -2, 3, -5);
			const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
			const noise = (Math.random() / 10) * plusOrMinus * Math.floor(yMax / 2) * on;
			return <Data>{
				x,
				y,
				line: line + noise
			};
		})
	);
</script>

<div class="grid h-[400px] rounded-sm border border-blue-400 p-4">
	<Chart
		{data}
		x="x"
		y="y"
		yNice
		y1="line"
		padding={{ top: 0, right: 0, bottom: 50, left: 50 }}
		yDomain={[yMin, yMax]}
		y1Domain={[yMin, yMax]}
		y1Scale={scaleLinear()}
		y1Range={({ yScale }) => yScale.domain()}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" rule grid />
				<Axis placement="bottom" rule grid />
				<Spline class="stroke-blue-400 stroke-2" />
				<Points y={(d) => context.y1Scale?.(d.line)} />
			</Svg>
		{/snippet}
	</Chart>
</div>
