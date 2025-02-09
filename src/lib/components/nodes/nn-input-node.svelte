<script lang="ts">
	import type { CustomNodeProps } from '$lib/types';
	import { Handle } from '@xyflow/svelte';

	let { handles }: CustomNodeProps = $props();
</script>

<div class="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
	<h1>Input</h1>
</div>
{#each handles as handle}
	{console.log(handle)}
	<Handle type={handle.type} position={handle.position} id={handle.id} />
{/each}}
