<script lang="ts">
	import { Canvas } from '@threlte/core';
	import type CC from 'camera-controls';
	import DefaultScene from '$lib/components/scenes/default-scene.svelte';
	import type { Mesh } from 'three';
	import SingleLayerTwoInput from '$lib/components/perceptrons/single-layer-two-input.svelte';

	let controls = $state<CC>();
	let mesh = $state<Mesh>();
</script>

<h1>Step Decision Function</h1>
<div class="h-[750px] w-full">
	<Canvas>
		<DefaultScene bind:controls bind:mesh />
	</Canvas>
</div>
<div class="m-2">
	<SingleLayerTwoInput />
</div>
