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

<div class="flex w-full justify-center">
	<div class="mt-4 flex max-w-prose flex-col justify-center">
		<article class="prose lg:prose-xl">
			<h2>Two Dimension Perceptron with Two Layers</h2>
			<p>This example is a Perceptron with two layers and two inputs.</p>
			<p>
				It uses a <a href="/activation-functions#step">Step</a> function by default. Experiment with
				the values!
			</p>
		</article>

		<div class="h-[500px] w-full border border-blue-400">
			<Canvas>
				<DefaultScene bind:controls bind:mesh bind:data />
			</Canvas>
		</div>
		<div class="m-2">
			<TwoLayerTwoInputTwoNeuron />
		</div>
	</div>
</div>
