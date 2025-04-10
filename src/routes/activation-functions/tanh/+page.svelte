<script lang="ts">
	import tanh_fn from '$lib/assets/tanh_fn.svg';
	import { ActivationFunction, type Input } from '$lib/types';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { activate, range } from '$lib/utils';

	const inputRange = range(-5, 5, 0.1);

	let data: Input[] = inputRange.map((val): Input => {
		return {
			input: val,
			output: +activate(ActivationFunction.Tanh, val).toFixed(4)
		};
	});
</script>

<h1 class="m-2 text-lg font-extrabold">Tanh</h1>
<img class="m-2" alt="The Sign Function" src={tanh_fn} />
<ActivationChart {data} />
