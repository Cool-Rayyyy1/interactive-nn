<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type CC from 'camera-controls';
	import DefaultScene from '$lib/components/scenes/default-scene.svelte';
	import type { Mesh } from 'three';
	import type { Network } from '$lib/types';
	import { networkValue3d } from '$lib/utils';
	import { SingleLayerTwoInputNetwork } from '$lib/networks/single-layer-two-inputs';
	import SingleLayerTwoInput from '$lib/components/perceptrons/single-layer-two-input.svelte';
	import { setNetworkContext } from '$lib/context';

	let controls = $state<CC>();
	let mesh = $state<Mesh>();

	let network: Network = $state(SingleLayerTwoInputNetwork);

	let data = $derived(networkValue3d(network));

	setNetworkContext(network);
</script>

<div class="flex w-full justify-center">
	<div class="mt-4 flex max-w-prose flex-col justify-center">
		<article class="prose lg:prose-xl">
			<h2>Two Dimension Perceptron with One Layer</h2>
			<p>This example is a Perceptron with one layer and two input dimensions.</p>
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
			<SingleLayerTwoInput />
		</div>
	</div>
</div>
