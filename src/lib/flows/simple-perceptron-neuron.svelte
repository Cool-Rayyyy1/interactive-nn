<script lang="ts">
	import { type NodeProps, Handle, Position } from '@xyflow/svelte';

	let { data }: NodeProps = $props();
</script>

<div>
	<div class="size-15 rounded-full border-2 border-blue-500 bg-blue-300 relative right-1"></div>
	<Handle id="1" type="target" position={Position.Left} style="opacity: 0%; " />
	<Handle id="2" type="source" position={Position.Right} style="opacity: 0%; left: 10px;" />
</div>
