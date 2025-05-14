<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import TwoLayerOneInput from '$lib/components/perceptrons/two-layer-one-input.svelte';
	import { setNetworkContext } from '$lib/context';
	import { TwoLayerOneInputNetwork } from '$lib/networks/two-layer-one-input';
	import type { Input2d, Network } from '$lib/types';
	import { networkValue2d } from '$lib/utils';

	let network: Network = $state(TwoLayerOneInputNetwork);

	let data: Input2d[] = $derived(networkValue2d(network));
	$inspect(data);

	setNetworkContext(network);
</script>

<div>
	<h1>Two Layer Perceptron</h1>
	<ActivationChart {data} />
	<div style:height="500px" class="border-2">
		<TwoLayerOneInput />
	</div>
</div>
