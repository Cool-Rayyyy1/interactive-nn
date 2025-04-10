<script lang="ts">
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
	import { ActivationFunction, type Input } from '$lib/types';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { activate, range } from '$lib/utils';

	const inputRange = range(-5, 5, 0.1);

	let data: Input[] = inputRange.map((val): Input => {
		return {
			input: val,
			output: +activate(ActivationFunction.Sigmoid, val).toFixed(4)
		};
	});
</script>

<h1 class="m-2 text-lg font-extrabold">Sigmoid</h1>
<img class="m-2" alt="The Sign Function" src={sigmoid_fn} />
<ActivationChart {data} />
