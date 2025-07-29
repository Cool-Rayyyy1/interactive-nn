<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { step, sigmoid, tanh, relu } from '$lib/math/latex';
	import { ActivationFunction, type SeriesData } from '$lib/types';
	import { activate, derive, range } from '$lib/utils';
	import { Math } from 'svelte-math';

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
			<div class="m-2 p-2">
				<Math latex={step} />
			</div>
			<ActivationChart data={stepData} showDx={false} {keys} />
		</div>

		<div id="sigmoid">
			<h2>Sigmoid</h2>
			<div class="m-2 p-2">
				<Math latex={sigmoid} />
			</div>
			<ActivationChart data={sigmoidData} showDx={false} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<div class="m-2 p-2">
				<Math latex={tanh} />
			</div>
			<ActivationChart data={tanhData} showDx={false} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<div class="m-2 p-2">
				<Math latex={relu} />
			</div>
			<ActivationChart data={reluData} showDx={false} {keys} />
		</div>
	</article>
</div>
