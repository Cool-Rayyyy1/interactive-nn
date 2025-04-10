<script lang="ts">
	import type { InputNodeType } from '$lib/types';
	import { Handle, useUpdateNodeInternals, type NodeProps } from '@xyflow/svelte';
	import { onMount } from 'svelte';

	let { id, data }: NodeProps<InputNodeType> = $props();

	const updateNodeInternals = useUpdateNodeInternals();

	onMount(() => {
		updateNodeInternals(id);
	});
</script>

<div class="w-22 rounded-full border-2 border-stone-400 bg-slate-100 px-4 py-2 shadow-md">
	<div>
		<h1>{data.display}</h1>
	</div>
	{#each data.handles as handle}
		<Handle type={handle.type} position={handle.position} />
	{/each}
</div>
