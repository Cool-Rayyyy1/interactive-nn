<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import SingleLayerPerceptron from '$lib/components/perceptrons/single-layer-perceptron.svelte';
	import { setNetworkContext } from '$lib/context';
	import { SingleLayerOneInputNetwork } from '$lib/networks/single-layer-one-input';
	import type { Network, SeriesData } from '$lib/types';
	import { networkValue2d } from '$lib/utils';

	const keys = ['activation'];

	let network: Network = $state(SingleLayerOneInputNetwork);

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
	<h1>Single-Layer Perceptron</h1>
	<ActivationChart {data} showDx={false} {keys} />
	<div style:height="500px" class="border-2">
		<SingleLayerPerceptron />
	</div>
</div>
