<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import TwoLayerOneInput from '$lib/components/perceptrons/two-layer-one-input.svelte';
	import { setNetworkContext } from '$lib/context';
	import { TwoLayerOneInputNetwork } from '$lib/networks/two-layer-one-input';
	import type { Network, SeriesData } from '$lib/types';
	import { networkValue2d } from '$lib/utils';

	const keys = ['activation'];

	let network: Network = $state(TwoLayerOneInputNetwork);

	let data: SeriesData[] = $derived.by(() => {
		return networkValue2d(network).map(
			(val): SeriesData =>
				<SeriesData>{
					input: val.input,
					activation: val.output,
					derivative: 0
				}
		);
	});

	setNetworkContext(network);
</script>

<div>
	<h1>Two Layer Perceptron</h1>
	<ActivationChart {data} showDx={false} {keys} />
	<div style:height="500px" class="border-2">
		<TwoLayerOneInput />
	</div>
</div>
