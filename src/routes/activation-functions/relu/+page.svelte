<script lang="ts">
	import relu_fn from '$lib/assets/relu_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction, type Input } from '$lib/types';
	import { activate, range } from '$lib/utils';

	const inputRange = range(-5, 5, 0.1);

	let data: Input[] = inputRange.map((val): Input => {
		return {
			input: val,
			output: +activate(ActivationFunction.ReLU, val).toFixed(4)
		};
	});
</script>

<h1 class="m-2 text-lg font-extrabold">ReLU</h1>
<img class="m-2" alt="The Sign Function" src={relu_fn} />
<ActivationChart {data} />
