<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';
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

	const step: string = `$$
f(x) = 
\\left \\{
\\begin{aligned}
  -1     &\\qquad \\text{if } x < 0   \\\\
  0      &\\qquad \\text{if } x = 0   \\\\
  1      &\\qquad \\text{if } x > 0
\\end{aligned} \\right.
$$`;

	const dx_step: string = `$$
f^{\\prime}(x) = 0
$$`;

	const sigmoid: string = `$$
f(x) = \\frac{1}{1 + e^{-x}}
$$`;

	const dx_sigmoid: string = `$$
f^{\\prime}(x) = \\frac{1}{1 + e^{-x}} \\times \\left( 1 - \\frac{1}{1 + e^{-x}}) \\right)
$$`;

	const tanh: string = `$$
f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}
$$`;

	const dx_tanh: string = `$$
f^{\\prime}(x) = 1 - \\left( \\frac{e^x - e^{-x}}{e^x + e^{-x}} \\right) = 1 - \\text{tanh}(x)^2
$$`;

	const relu: string = `$$
f(x) = \\text{max}(0, x) = 
\\left \\{
\\begin{aligned}
  x     &\\qquad \\text{if } x > 0   \\\\
  0      &\\qquad \\text{if } x \\leq 0   \\\\
\\end{aligned} \\right. 
$$`;

	const dx_relu: string = `$$
f^{\\prime}(x) =  
\\left \\{
\\begin{aligned}
  1     &\\qquad \\text{if } x \\geq 0   \\\\
  0      &\\qquad \\text{if } x < 0   \\\\
\\end{aligned} \\right. 
$$`;
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div id="derivative-of-activation-functions">
			<h2>Derivatives of Activation Function</h2>
		</div>

		<div id="step">
			<h3>Step</h3>
			<Mathjax math={step} />
			<Mathjax math={dx_step} />
			<ActivationChart data={stepData} showDx={true} {keys} />
		</div>

		<div id="sigmoid">
			<h3>Sigmoid</h3>
			<Mathjax math={sigmoid} />
			<Mathjax math={dx_sigmoid} />
			<ActivationChart data={sigmoidData} showDx={true} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<Mathjax math={tanh} />
			<Mathjax math={dx_tanh} />
			<ActivationChart data={tanhData} showDx={true} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<Mathjax math={relu} />
			<Mathjax math={dx_relu} />
			<ActivationChart data={reluData} showDx={true} {keys} />
		</div>
	</article>
</div>
