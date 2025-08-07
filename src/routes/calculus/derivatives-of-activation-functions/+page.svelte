<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import {
		dx_relu,
		dx_sigmoid,
		dx_step,
		dx_tanh,
		relu,
		sigmoid,
		step,
		tanh
	} from '$lib/math/latex';
	import { ActivationFunction, type SeriesData } from '$lib/types';
	import { activate, derive, range } from '$lib/utils';
	import { Math } from 'svelte-math';
	import * as Card from '$lib/components/ui/card/index.js';

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
			<div class="grid grid-cols-1 gap-y-2">
				<div class="grid grid-cols-2 gap-x-2">
					<Card.Root class="flex items-center">
						<Math latex={step} displayMode />
					</Card.Root>
					<Card.Root class="flex items-center">
						<Math latex={dx_step} displayMode />
					</Card.Root>
				</div>

				<ActivationChart data={stepData} showDx={true} {keys} />
			</div>
		</div>

		<div id="sigmoid">
			<h3>Sigmoid</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<div class="grid grid-cols-2 gap-x-2">
					<Card.Root class="flex items-center">
						<Math latex={sigmoid} displayMode />
					</Card.Root>
					<Card.Root class="flex items-center">
						<Math latex={dx_sigmoid} displayMode />
					</Card.Root>
				</div>

				<ActivationChart data={sigmoidData} showDx={true} {keys} />
			</div>
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<div class="grid grid-cols-2 gap-x-2">
					<Card.Root class="flex items-center">
						<Math latex={tanh} displayMode />
					</Card.Root>
					<Card.Root class="flex items-center">
						<Math latex={dx_tanh} displayMode />
					</Card.Root>
				</div>

				<ActivationChart data={tanhData} showDx={true} {keys} />
			</div>
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<div class="grid grid-cols-2 gap-x-2">
					<Card.Root class="flex items-center">
						<Math latex={relu} displayMode />
					</Card.Root>
					<Card.Root class="flex items-center">
						<Math latex={dx_relu} displayMode />
					</Card.Root>
				</div>

				<ActivationChart data={reluData} showDx={true} {keys} />
			</div>
		</div>
	</article>
</div>
