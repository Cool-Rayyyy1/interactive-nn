<script lang="ts">
	import { Handle, useSvelteFlow, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte';
	import { onMount } from 'svelte';
	import type { WeightNodeType } from '$lib/types';

	let { id, data }: NodeProps<WeightNodeType> = $props();

	const { updateNodeData } = useSvelteFlow();
	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
		updateNodeData(id, { weight: data.productNode.weight });
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
			value={data.productNode.weight}
			oninput={(evt) => {
				updateNodeData(id, { weight: evt.currentTarget.value });
			}}
		/></span
	>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} />
	{/each}
</div>
