<script lang="ts">
	import sign_fn from '$lib/assets/sign_fn.svg';
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
	import tanh_fn from '$lib/assets/tanh_fn.svg';
	import relu_fn from '$lib/assets/relu_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction, type SeriesData } from '$lib/types';
	import { activate, derive, range } from '$lib/utils';

	const keys = ['activation', 'derivative'];

	const inputRange = range(-3, 3, 0.01);

	let stepData: SeriesData[] = inputRange.map(
		(val): SeriesData =>
			<SeriesData>{
				input: val,
				activation: +activate(ActivationFunction.Step, val).toFixed(4),
				derivative: +derive(ActivationFunction.Step, val).toFixed(4)
			}
	);

	const smallInputRange = range(-3, 3, 0.1);

	let sigmoidData: SeriesData[] = smallInputRange.map(
		(val): SeriesData =>
			<SeriesData>{
				input: val,
				activation: +activate(ActivationFunction.Sigmoid, val).toFixed(4),
				derivative: +derive(ActivationFunction.Sigmoid, val).toFixed(4)
			}
	);

	let tanhData: SeriesData[] = smallInputRange.map(
		(val): SeriesData =>
			<SeriesData>{
				input: val,
				activation: +activate(ActivationFunction.Tanh, val).toFixed(4),
				derivative: +derive(ActivationFunction.Tanh, val).toFixed(4)
			}
	);

	let reluData: SeriesData[] = inputRange.map(
		(val): SeriesData =>
			<SeriesData>{
				input: val,
				activation: +activate(ActivationFunction.ReLU, val).toFixed(4),
				derivative: +derive(ActivationFunction.ReLU, val).toFixed(4)
			}
	);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div id="derivative-of-activation-functions">
			<h2>Derivatives of Activation Function?</h2>
		</div>

		<div id="step">
			<img class="m-2" alt="The Sign Function" src={sign_fn} />
			<ActivationChart data={stepData} showDx={true} {keys} />
		</div>

		<div id="sigmoid">
			<img class="m-2" alt="The Sigmoid Function" src={sigmoid_fn} />
			<ActivationChart data={sigmoidData} showDx={true} {keys} />
		</div>

		<div id="tanh">
			<img class="m-2" alt="The Tanh Function" src={tanh_fn} />
			<ActivationChart data={tanhData} showDx={true} {keys} />
		</div>

		<div id="relu">
			<img class="m-2" alt="The ReLU Function" src={relu_fn} />
			<ActivationChart data={reluData} showDx={true} {keys} />
		</div>
	</article>
</div>
