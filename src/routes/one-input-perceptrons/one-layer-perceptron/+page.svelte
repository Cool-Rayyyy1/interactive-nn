<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import SingleLayerPerceptron from '$lib/components/perceptrons/single-layer-perceptron.svelte';
	import { setNetworkContext } from '$lib/context';
	import { SingleLayerOneInputNetwork } from '$lib/networks/single-layer-one-input';
	import type { Input2d, Network } from '$lib/types';
	import { networkValue2d } from '$lib/utils';

	let network: Network = $state(SingleLayerOneInputNetwork);

	let data: Input2d[] = $derived(networkValue2d(network));

	setNetworkContext(network);
</script>

<div>
	<h1>Single-Layer Perceptron</h1>
	<ActivationChart {data} />
	<div style:height="500px" class="border-2">
		<SingleLayerPerceptron />
	</div>
</div>
