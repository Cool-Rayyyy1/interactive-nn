<script lang="ts">
	import sign_fn from '$lib/assets/sign_fn.svg';
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
	import tanh_fn from '$lib/assets/tanh_fn.svg';
	import relu_fn from '$lib/assets/relu_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction, type SeriesData } from '$lib/types';
	import { activate, derive, range } from '$lib/utils';

	const keys = ['activation'];

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
		<div id="what-is-an-activation-function">
			<h2>What is an Activation Function?</h2>
			<p>Activation functions are non-linear transformations.</p>
			<p>An Activation Function applies a non-linear transformation to some weighted input.</p>
		</div>

		<div id="step">
			<h3>Step</h3>
			<img class="m-2" alt="The Sign Function" src={sign_fn} />
			<ActivationChart data={stepData} showDx={false} {keys} />
		</div>

		<div id="sigmoid">
			<h2>Sigmoid</h2>
			<img class="m-2" alt="The Sigmoid Function" src={sigmoid_fn} />
			<ActivationChart data={sigmoidData} showDx={false} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<img class="m-2" alt="The Tanh Function" src={tanh_fn} />
			<ActivationChart data={tanhData} showDx={false} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<img class="m-2" alt="The ReLU Function" src={relu_fn} />
			<ActivationChart data={reluData} showDx={false} {keys} />
		</div>
	</article>
</div>
