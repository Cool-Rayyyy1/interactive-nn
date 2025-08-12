<script lang="ts">
	import { type NodeProps, Handle, Position } from '@xyflow/svelte';
	import { Math } from 'svelte-math';

	let { data }: NodeProps = $props();
</script>

<div>
	<Math latex={`\\text{${data.output}}`} />
	<Handle type="target" position={Position.Left} style="opacity: 0%; left: 2px;" />
</div>
