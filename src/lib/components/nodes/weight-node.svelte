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
</div>
