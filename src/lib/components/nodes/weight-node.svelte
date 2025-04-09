<script lang="ts">
	import {
		Handle,
		useNodeConnections,
		useNodesData,
		useSvelteFlow,
		useUpdateNodeInternals,
		type NodeProps
	} from '@xyflow/svelte';
	import { onMount, untrack } from 'svelte';
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

	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
		updateNodeData(id, { weight: 1 });
	});
</script>

<div class="w-22 rounded-md border-2 border-stone-400 bg-stone-500 p-2 shadow-md">
	<span class="text-gray-900"
		>W: <input
			class="w-10 bg-gray-100 p-1"
			value={data.weight}
			oninput={(evt) => {
				updateNodeData(id, { weight: evt.currentTarget.value });
			}}
		/></span
	>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} />
	{/each}
</div>
