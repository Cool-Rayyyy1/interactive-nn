<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;
</script>

<div
	class=" relative flex h-20 w-20 place-content-center overflow-hidden rounded-full border border-stone-400 bg-slate-400 p-1"
>
	<div class="flex place-content-center">
		<div class="text-md text-center font-bold">Neuron</div>
	</div>
</div>
<Handle type="target" position={Position.Bottom} />
