<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { Axis, Chart, Points, Spline, Svg, Tooltip, Highlight } from 'layerchart';

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

	const noiseData: number[] = dataRange.map(() => {
		const plusOrMinus = Math.random() < 0.5 ? -1 : 1;
		return (Math.random() / 10) * plusOrMinus * Math.floor(yMax / 2) * on;
	});

	function polynomial(x: number, k_0: number, k_1: number, k_2: number, k_3: number): number {
		return k_0 + k_1 * x + k_2 * x ** 2 + k_3 * x ** 3;
	}

	const data: Data[] = $derived(
		dataRange.map((val, i): Data => {
			const x = val;
			const y = polynomial(x, k_0, k_1, k_2, k_3);
			const line = polynomial(x, 3, -2, 3, -5);
			return <Data>{
				x,
				y,
				line: line + noiseData[i]
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
		tooltip={{ mode: 'bisect-x' }}
	>
		{#snippet children({ context })}
			<Svg>
				<Axis placement="left" rule grid />
				<Axis placement="bottom" rule grid />
				<Spline class="stroke-blue-400 stroke-2" />
				<Points y={(d) => context.y1Scale?.(d.line)} />
				<Highlight points={{ class: 'fill-blue-400' }} lines />
				<Highlight points={{ class: 'fill-green-400' }} y={(d) => context.y1Scale?.(d.line)} />
			</Svg>

			<Tooltip.Root {context}>
				{#snippet children({ data })}
					<Tooltip.Header value={'Response'} />
					<Tooltip.List>
						<Tooltip.Item label="x" value={data.x.toFixed(2)} color="oklch(67.3% 0.182 276.935)" />
						<Tooltip.Item
							label="f(x)"
							value={data.y.toFixed(2)}
							color="oklch(70.7% 0.165 254.624)"
						/>
						<Tooltip.Item
							label="Point"
							value={data.line.toFixed(2)}
							color="oklch(79.2% 0.209 151.711)"
						/>
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>

			<Tooltip.Root
				{context}
				x="data"
				y={context.height}
				anchor="top"
				class="mt-[1px] whitespace-nowrap rounded-sm border border-primary bg-indigo-300 px-2 py-[1px] text-[10px] font-semibold text-primary"
				contained={false}
			>
				{#snippet children({ data })}
					{context.x(data)}
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</Chart>
</div>
