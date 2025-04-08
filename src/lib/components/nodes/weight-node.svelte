<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;
</script>

<div
	class=" relative flex h-20 w-20 place-content-center overflow-hidden rounded-full border border-slate-400 bg-stone-500 p-1"
>
	<div class="flex place-content-center">
		<div class="text-md text-center font-bold">Weight</div>
	</div>
</div>
<Handle type="source" position={Position.Top} />
<Handle type="target" position={Position.Bottom} />
