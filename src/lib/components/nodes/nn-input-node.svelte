<script lang="ts">
	import type { InputNodeType } from '$lib/types';
	import { Handle, useSvelteFlow, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte';
	import { onMount } from 'svelte';

	let { id, data }: NodeProps<InputNodeType> = $props();
	const { updateNodeData } = useSvelteFlow();

	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
		updateNodeData(id, { input: 1 });
	});
</script>

<div class="w-22 rounded-full border-2 border-stone-400 bg-slate-100 px-4 py-2 shadow-md">
	<div>
		<span class="text-gray-900"
			>X: <input
				class="w-10 bg-gray-100 p-1"
				value={data.input}
				oninput={(evt) => {
					updateNodeData(id, { input: evt.currentTarget.value });
				}}
			/></span
		>
	</div>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} />
	{/each}
</div>
