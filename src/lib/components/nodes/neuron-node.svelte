<script lang="ts">
	import { type NeuronNodeType } from '$lib/types';
	import { Handle, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte';
	import { onMount } from 'svelte';

	let { id, data }: NodeProps<NeuronNodeType> = $props();

	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
	});
</script>

<!--
@component
An xyflow Node for a Neuron in a Neural Network.

The layer it receives input from and a list of handles 
can be passed as props.
-->
<div class="w-30 h-30 rounded-full border-2 border-stone-400 bg-blue-400 p-4 shadow-md">
	<div>
		<div>
			<h1>{data.neuron.activation}</h1>
		</div>
	</div>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} id={handle.id} />
	{/each}
</div>
