<script lang="ts">
	import sign_fn from '$lib/assets/sign_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction, type Input } from '$lib/types';
	import { activate, range } from '$lib/utils';

	const inputRange = range(-5, 5, 0.01);

	let data: Input[] = inputRange.map((val): Input => {
		return {
			input: val,
			output: +activate(ActivationFunction.Step, val).toFixed(4)
		};
	});
</script>

<h1 class="m-2 text-lg font-extrabold">Step Function</h1>
<h2>
	One variation of a step function is the Sign function. This function takes in some value x, and
	assigns it a value. For example:
</h2>
<img class="m-2" alt="The Sign Function" src={sign_fn} />
<ActivationChart {data} />
