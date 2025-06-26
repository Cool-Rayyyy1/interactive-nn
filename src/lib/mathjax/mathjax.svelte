<script lang="ts">
	import { onMount } from 'svelte';

	let { math = $bindable() }: { math: string } = $props();

	let svg = math;

	onMount(() => {
		window.MathJax.typeset();
	});
</script>

<div class="inline">{@html svg}</div>
