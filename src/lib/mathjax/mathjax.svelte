<script lang="ts">
	import { onMount } from 'svelte';

	let { math = $bindable() } = $props();

	onMount(() => {
		let script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
		script.id = 'mathjax';
		document.head.append(script);

		script.onload = () => {
			MathJax = {
				tex: {
					inlineMath: [
						['$', '$'],
						['\\(', '\\)']
					]
				},
				svg: { fontCache: 'global' }
			};
		};
	});

	$effect(() => {
		MathJax = {
			tex: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)']
				]
			},
			svg: { fontCache: 'global' }
		};
	});
</script>

<div class="inline">
	{math}
</div>
