<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;
</script>

<div class="rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md">
	<div class="flex">
		<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">C</div>
		<div class="ml-2">
			<div class="text-lg font-bold">John</div>
			<div class="text-gray-500">Designer</div>
		</div>
	</div>
	<Handle type="target" position={Position.Bottom} />
</div>
