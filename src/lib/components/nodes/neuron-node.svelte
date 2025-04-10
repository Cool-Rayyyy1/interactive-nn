<script lang="ts">
	import { type NeuronNodeType } from '$lib/types';
	import {
		Handle,
		useNodeConnections,
		useNodesData,
		useUpdateNodeInternals,
		type NodeProps
	} from '@xyflow/svelte';
	import { onMount } from 'svelte';

	let { id, data }: NodeProps<NeuronNodeType> = $props();

	const connections = useNodeConnections({
		id,
		handleType: 'target'
	});

	let nodesData = $derived(
		useNodesData(connections.current.map((connection) => connection.source))
	);

	let neuronVal = $state(0);

	$effect.pre(() => {
		neuronVal = 0;
	});

	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
		neuronVal = 0;
	});
</script>

<div class="w-30 h-30 rounded-full border-2 border-stone-400 bg-blue-400 p-4 shadow-md">
	<div>
		{#if nodesData.current.length === 0}
			<div>no connected nodes</div>
		{:else}
			<div>
				<h1>{neuronVal}</h1>
			</div>
		{/if}
	</div>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} id={handle.id} />
	{/each}
</div>
