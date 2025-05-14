<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type CC from 'camera-controls';
	import DefaultScene from '$lib/components/scenes/default-scene.svelte';
	import type { Mesh } from 'three';
	import type { Network } from '$lib/types';
	import { networkValue3d } from '$lib/utils';
	import { setNetworkContext } from '$lib/context';
	import { TwoLayerTwoInputNetworkTwoNeuron } from '$lib/networks/two-layer-two-input-two-neuron';
	import TwoLayerTwoInputTwoNeuron from '$lib/components/perceptrons/two-layer-two-input-two-neuron.svelte';

	let controls = $state<CC>();
	let mesh = $state<Mesh>();

	let network: Network = $state(TwoLayerTwoInputNetworkTwoNeuron);

	let data = $derived(networkValue3d(network));

	setNetworkContext(network);
</script>

<h1>Step Decision Function</h1>
<div class="h-[750px] w-full">
	<Canvas>
		<DefaultScene bind:controls bind:mesh bind:data />
	</Canvas>
</div>
<div class="m-2">
	<TwoLayerTwoInputTwoNeuron />
</div>
