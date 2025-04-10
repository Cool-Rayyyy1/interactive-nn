<script lang="ts">
	import type { Coords } from '$lib/types';
	import { range, sigmoid } from '$lib/utils';
	import { Axis, Chart, Spline, Svg, Tooltip, Highlight } from 'layerchart';

	let sgnRange = range(-10, 10, 0.1);

	let data: Coords[] = sgnRange.map((val): Coords => {
		return {
			x: val,
			y: +sigmoid(val).toFixed(4)
		};
	});
</script>

<div class="h-[300px] rounded border p-4">
	<Chart {data} x="x" y="y" yNice padding={{ left: 16, bottom: 24 }} tooltip={{ mode: 'bisect-x' }}>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis placement="bottom" grid rule />
			<Spline class="stroke-primary stroke-2" />
			<Highlight points lines />
		</Svg>

		<Tooltip.Root let:data>
			<Tooltip.Header>Coordinates</Tooltip.Header>
			<Tooltip.List>
				<Tooltip.Item label="(x, y): " value={'(' + data.x + ', ' + data.y + ')'} />
			</Tooltip.List>
		</Tooltip.Root>
	</Chart>
</div>
