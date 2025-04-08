<script lang="ts">
	import {
		Handle,
		Position,
		useNodeConnections,
		useNodesData,
		useSvelteFlow,
		type NodeProps
	} from '@xyflow/svelte';
	import { untrack } from 'svelte';
	import { isInputNode } from '$lib/utils';
	import type { WeightNodeType } from '$lib/types';

	let { id, data }: NodeProps<WeightNodeType> = $props();

	const { updateNodeData } = useSvelteFlow();

	const connections = useNodeConnections();

	let nodeData = $derived(useNodesData(connections.current[0]?.source));
	let textNodeData = $derived(isInputNode(nodeData.current) ? nodeData.current.data : null);

	$effect.pre(() => {
		const input = textNodeData?.input ?? '';

		if (input === untrack(() => data.input)) return;
		updateNodeData(id, {
			input: input
		});
	});
</script>

<<<<<<< HEAD
<div
	class=" relative flex h-20 w-20 place-content-center overflow-hidden rounded-full border border-slate-400 bg-stone-500 p-1"
>
	<div class="flex place-content-center">
		<div class="text-md text-center font-bold">Weight</div>
	</div>
=======
<div class="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
	<div>Weight</div>
	<h2>Input: {data.input}</h2>
	<input
		value={data.weight}
		oninput={(evt) => {
			updateNodeData(id, { weight: evt.currentTarget.value });
			console.log(evt.currentTarget.value);
		}}
	/>
	<Handle type="target" position={Position.Left} isConnectable={connections.current.length === 0} />
	<Handle type="source" position={Position.Right} />
>>>>>>> 3d7092e24b27123a05678628be7a94c3df70035c
</div>
