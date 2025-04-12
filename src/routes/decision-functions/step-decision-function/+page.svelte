<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type CC from 'camera-controls';
	import DefaultScene from '$lib/components/scenes/default-scene.svelte';
	import type { Mesh } from 'three';
	import type { Network } from '$lib/types';
	import { networkValue } from '$lib/utils';
	import { SingleLayerTwoInputNetwork } from '$lib/networks/single-layer-two-inputs';
	import SingleLayerTwoInput from '$lib/components/perceptrons/single-layer-two-input.svelte';
	import { setNetworkContext } from '$lib/context';

	let controls = $state<CC>();
	let mesh = $state<Mesh>();

	let network: Network = $state(SingleLayerTwoInputNetwork);

	let data = $derived(networkValue(network));

	setNetworkContext(network);
</script>

<h1>Step Decision Function</h1>
<div class="h-[750px] w-full">
	<Canvas>
		<DefaultScene bind:controls bind:mesh bind:data />
	</Canvas>
</div>
<div class="m-2">
	<SingleLayerTwoInput />
</div>
