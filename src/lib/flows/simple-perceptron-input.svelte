<script lang="ts">
	import { type NodeProps, Handle, Position } from '@xyflow/svelte';
	import { Math } from 'svelte-math';

	let { data }: NodeProps = $props();
</script>

<div class="top-1">
	<div class="relative bottom-1.5 left-1">
		<Math latex={`x_${data.index}`} />
	</div>
	<Handle type="source" position={Position.Right} style="opacity: 0%;" />
</div>
