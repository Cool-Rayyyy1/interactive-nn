<script lang="ts">
	import { Handle, useSvelteFlow, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte';
	import { onMount } from 'svelte';
	import type { Network, Weight, WeightNodeType } from '$lib/types';
	import { getNetworkContext } from '$lib/context';

	let { id, data = $bindable() }: NodeProps<WeightNodeType> = $props();
	let network: Network = getNetworkContext();
	let weight: Weight = $state(network.layers[data.layer].weights[data.neuron][data.index]);

	let { updateNodeData } = useSvelteFlow();
	let updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
		updateNodeData(id, { weight: weight.value });
	});
</script>

<!--
@component
An xyflow Node for a Weight in a Neural Network. Users
can interact with the weight value of this node to experiment
with the Neural Network.

The input node associated with its weight and its list of handles 
can be passed as props.
-->
<div class="w-22 rounded-md border-2 border-stone-400 bg-stone-500 p-2 shadow-md">
	<span class="text-gray-900"
		>W: <input
			class="w-10 bg-gray-100 p-1"
			value={weight.value}
			type="number"
			oninput={(evt) => {
				updateNodeData(id, { weight: evt.currentTarget.value });
				weight.value = +evt.currentTarget.value;
			}}
		/></span
	>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} />
	{/each}
</div>
