<script lang="ts">
	import { type NodeProps, Handle, Position } from '@xyflow/svelte';
	import { Math } from 'svelte-math';

	let { data }: NodeProps = $props();
</script>

<div class="top-1">
	<div class="relative bottom-1.5 left-1 bg-slate-200 m-1 p-1 rounded-sm border border-blue-400">
		<Math latex={`x_${data.index} = ${data.day} = ${data.value}`} />
	</div>
	<Handle type="source" position={Position.Right} style="opacity: 0%;" />
</div>
