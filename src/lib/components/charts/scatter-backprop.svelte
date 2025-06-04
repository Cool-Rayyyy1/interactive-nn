<script lang="ts">
	import { Legend, ScatterChart, Tooltip } from 'layerchart';

	const data = [
		// 0
		{
			x: 0,
			y: 0
		},
		{
			x: 0.3,
			y: 2
		},
		{
			x: 0.5,
			y: 5
		},
		{
			x: 0.7,
			y: 7
		},
		{
			x: 0.9,
			y: 8
		},
		// 1
		{
			x: 1,
			y: 10
		},
		{
			x: 1.1,
			y: 11
		},
		{
			x: 1.4,
			y: 13
		},
		{
			x: 1.5,
			y: 13
		},
		{
			x: 1.8,
			y: 14
		},
		// 2
		{
			x: 2.2,
			y: 12
		},
		{
			x: 2.3,
			y: 6
		},
		{
			x: 2.5,
			y: -1
		},
		{
			x: 2.9,
			y: -5
		},
		{
			x: 2,
			y: 15
		},
		// 3
		{
			x: 3,
			y: -10
		},
		{
			x: 3.1,
			y: -9
		},
		{
			x: 3.4,
			y: -2
		},
		{
			x: 3.7,
			y: 3
		},
		{
			x: 3.9,
			y: 4
		},
		// 4
		{
			x: 4,
			y: 5
		},
		{
			x: 4.1,
			y: 7
		},
		{
			x: 4.4,
			y: 10
		},
		{
			x: 4.5,
			y: 10
		},
		{
			x: 4.8,
			y: 11
		},
		// 5
		{
			x: 5,
			y: 12
		},
		{
			x: 5.3,
			y: 13
		},
		{
			x: 5.4,
			y: 15
		},
		{
			x: 5.5,
			y: 16
		},
		{
			x: 5.8,
			y: 16
		},
		// 6
		{
			x: 6,
			y: 17
		},
		{
			x: 6.3,
			y: 13
		},
		{
			x: 6.4,
			y: 7
		},
		{
			x: 6.5,
			y: 6
		},
		{
			x: 6.8,
			y: 3
		},
		// 7
		{
			x: 7,
			y: 0
		},
		{
			x: 7.1,
			y: -1
		},
		{
			x: 7.2,
			y: -3
		},
		{
			x: 7.5,
			y: -3
		},
		{
			x: 7.9,
			y: -4
		},
		// 8
		{
			x: 8,
			y: -3
		},
		{
			x: 8.2,
			y: -1
		},
		{
			x: 8.5,
			y: 0
		},
		{
			x: 8.6,
			y: 3
		},
		{
			x: 8.9,
			y: 3
		},
		// 9
		{
			x: 9,
			y: 4
		},
		{
			x: 9.1,
			y: 3
		},
		{
			x: 9.4,
			y: 2
		},
		{
			x: 9.6,
			y: 0
		},
		{
			x: 9.9,
			y: -2
		},
		// 10
		{
			x: 10,
			y: -4
		}
	];
</script>

<div class="h-[400px] rounded-sm border border-blue-400 p-4">
	<ScatterChart {data} x="x" y="y" padding={{ top: 0, right: 0, bottom: 50, left: 50 }}>
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
					{context.y(data)}
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
