<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction, type SeriesData } from '$lib/types';
	import { activate, derive, range } from '$lib/utils';
	import Mathjax from '$lib/mathjax/mathjax.svelte';

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

	const step: string = `$$
f(x) = 
\\left \\{
\\begin{aligned}
  -1     &\\qquad \\text{if } x < 0   \\\\
  0      &\\qquad \\text{if } x = 0   \\\\
  1      &\\qquad \\text{if } x > 0
\\end{aligned} \\right.
$$`;

	const sigmoid: string = `$$
f(x) = \\frac{1}{1 + e^{-x}}
$$`;

	const tanh: string = `$$
f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}
$$`;

	const relu: string = `$$
f(x) = \\text{max}(0, x) = 
\\left \\{
\\begin{aligned}
  x     &\\qquad \\text{if } x > 0   \\\\
  0      &\\qquad \\text{if } x \\leq 0   \\\\
\\end{aligned} \\right. 
$$`;
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
			<Mathjax math={step} />
			<ActivationChart data={stepData} showDx={false} {keys} />
		</div>

		<div id="sigmoid">
			<h2>Sigmoid</h2>
			<Mathjax math={sigmoid} />
			<ActivationChart data={sigmoidData} showDx={false} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<Mathjax math={tanh} />
			<ActivationChart data={tanhData} showDx={false} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<Mathjax math={relu} />
			<ActivationChart data={reluData} showDx={false} {keys} />
		</div>
	</article>
</div>
