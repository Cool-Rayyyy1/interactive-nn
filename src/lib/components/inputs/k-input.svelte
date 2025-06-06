<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	let {
		index,
		value = $bindable(),
		min,
		max,
		disabled
	}: { index: string; value: number; min: number; max: number; disabled: boolean } = $props();
</script>

<div class="m-2 flex w-full max-w-sm flex-col gap-1.5">
	<Label for="k">k<sub>{index}</sub></Label>
	<Input {disabled} type="number" id="k" placeholder="k" bind:value {min} {max} />
</div>
