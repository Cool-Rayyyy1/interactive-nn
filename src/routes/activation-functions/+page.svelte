<script>
	import sign_fn from '$lib/assets/sign_fn.svg';
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
	import tanh_fn from '$lib/assets/tanh_fn.svg';
	import relu_fn from '$lib/assets/relu_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction } from '$lib/types';
	import { activate, dx_sigmoid, range } from '$lib/utils';

	const inputRange = range(-5, 5, 0.01);

	let stepData = inputRange.map((val) => {
		return {
			input: val,
			output: +activate(ActivationFunction.Step, val).toFixed(4),
			derivative: 0
		};
	});

	const smallInputRange = range(-5, 5, 0.1);

	let sigmoidData = smallInputRange.map((val) => {
		return {
			input: val,
			output: +activate(ActivationFunction.Sigmoid, val).toFixed(4),
			derivative: dx_sigmoid(val)
		};
	});

	let tanhData = smallInputRange.map((val) => {
		return {
			input: val,
			output: +activate(ActivationFunction.Tanh, val).toFixed(4),
			derivative: 0
		};
	});

	let reluData = inputRange.map((val) => {
		return {
			input: val,
			output: +activate(ActivationFunction.ReLU, val).toFixed(4),
			derivative: 0
		};
	});
</script>

<div>
	<h1>Activation Functions</h1>

	<div id="what-is-an-activation-function">
		<h1>What is an Activation Function?</h1>
		<p>Activation functions are non-linear transformations.</p>
		<p>An Activation Function applies a non-linear transformation to some weighted input.</p>
	</div>

	<div id="step">
		<img class="m-2" alt="The Sign Function" src={sign_fn} />
		<ActivationChart data={stepData} />
	</div>

	<div id="sigmoid">
		<img class="m-2" alt="The Sigmoid Function" src={sigmoid_fn} />
		<ActivationChart data={sigmoidData} />
	</div>

	<div id="tanh">
		<img class="m-2" alt="The Tanh Function" src={tanh_fn} />
		<ActivationChart data={tanhData} />
	</div>

	<div id="relu">
		<img class="m-2" alt="The ReLU Function" src={relu_fn} />
		<ActivationChart data={reluData} />
	</div>
</div>
