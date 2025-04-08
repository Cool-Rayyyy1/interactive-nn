<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;
</script>

<div class="colorpicker">
	<input class="nodrag" type="color" />
	<Handle type="source" position={Position.Top} />
</div>
