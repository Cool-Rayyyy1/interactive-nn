<script lang="ts">
	import SingleLayerTwoInput from '$lib/components/perceptrons/single-layer-two-input.svelte';
	import { setNetworkContext } from '$lib/context';
	import { SingleLayerTwoInputNetwork } from '$lib/networks/single-layer-two-inputs';
	import type { Input3d, Network } from '$lib/types';
	import { networkValue3d } from '$lib/utils';

	let network: Network = $state(SingleLayerTwoInputNetwork);
	$inspect(network.inputs);

	let data: Input3d[] = $derived(networkValue3d(network));
	$inspect(data);

	setNetworkContext(network);
</script>

<div>
	<h1>Single-Layer Perceptron</h1>
	<div style:height="500px" class="border-2">
		<SingleLayerTwoInput />
	</div>
</div>
