<script lang="ts">
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
			<h2>Derivatives of Activation Function</h2>
		</div>

		<div id="step">
			<h3>Step</h3>
			<ActivationChart data={stepData} showDx={true} {keys} />
		</div>

		<div id="sigmoid">
			<h3>Sigmoid</h3>
			<ActivationChart data={sigmoidData} showDx={true} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<ActivationChart data={tanhData} showDx={true} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<ActivationChart data={reluData} showDx={true} {keys} />
		</div>
	</article>
</div>
