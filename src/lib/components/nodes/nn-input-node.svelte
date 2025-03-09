<script lang="ts">
	import type { InputNodeType } from '$lib/types';
	import { Handle, Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';

	let { id, data }: NodeProps<InputNodeType> = $props();
	const { updateNodeData } = useSvelteFlow();
</script>

<div class="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
	<h1>Input</h1>
	<div>
		<input
			value={data.input}
			oninput={(evt) => {
				updateNodeData(id, { input: evt.currentTarget.value });
			}}
		/>
	</div>
	<Handle type="source" position={Position.Top} />
</div>
