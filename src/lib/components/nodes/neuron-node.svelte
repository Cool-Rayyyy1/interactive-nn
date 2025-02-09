<script lang="ts">
	import type { CustomNodeProps } from '$lib/types';
	import { Handle } from '@xyflow/svelte';

	let { handles }: CustomNodeProps = $props();
</script>

<div
	class="relative flex h-20 w-20 flex-1 place-content-center overflow-hidden rounded-full border border-slate-400 bg-blue-200 p-1"
>
	<div class="text-md text-center font-bold">Neuron</div>
</div>
{#each handles as handle}
	{console.log(handle)}
	<Handle type={handle.type} position={handle.position} id={handle.id} />
{/each}}
