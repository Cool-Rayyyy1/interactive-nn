<script lang="ts">
	import type { NeuronNodeType } from '$lib/types';
	import {
		Handle,
		Position,
		useNodeConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';

	let { id }: NodeProps<NeuronNodeType> = $props();

	const connections = useNodeConnections({
		id,
		handleType: 'target'
	});

	const nodesData = useNodesData(connections.current.map((connection) => connection.source));
</script>

<div
<<<<<<< HEAD
	class=" relative flex h-20 w-20 place-content-center overflow-hidden rounded-full border border-stone-400 bg-slate-400 p-1"
=======
	class="relative flex h-72 w-72 flex-1 place-content-center overflow-hidden rounded-full border border-slate-400 bg-blue-200 p-1"
>>>>>>> 3d7092e24b27123a05678628be7a94c3df70035c
>
	<div>
		<h1 class="text-md text-center font-bold">Neuron</h1>
		{#if nodesData.current.length === 0}
			<div>no connected nodes</div>
		{:else}
			<div>
				{#each nodesData.current as nodeData}
					<div>
						<h1>Input:{nodeData.data.input}</h1>
						<h1>Weight:{nodeData.data.weight}</h1>
						{#if !Number.isNaN(nodeData.data.weight * nodeData.data.input)}
							<div>
								{nodeData.data.weight * nodeData.data.input}
							</div>
						{:else}
							<div>Please enter valid numbers.</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<Handle type="target" position={Position.Bottom} />
</div>
