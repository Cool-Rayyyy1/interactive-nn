<script lang="ts">
	import ScatterBackprop from '$lib/components/charts/scatter-backprop.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import KInput from '$lib/components/inputs/k-input.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { range } from '$lib/utils';
	import PolyChart from '$lib/components/charts/poly-chart.svelte';

	let k_0 = $state(1);
	let k_1 = $state(1);
	let k_2 = $state(1);
	let k_3 = $state(1);

	const basicPolynomial: string = `$$
x^3 + x^2 + x + 1
$$`;

	const basicPolynomialCoefficients: string = `$$
4x^3 - 2x^2 + 7x + 8
$$`;

	const generalPolynomial: string = `$$
f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3
$$`;
</script>

{#snippet polynomialStatement()}
	<math>f(x) = {k_0} + ({k_1})x + ({k_2})x<sup>2</sup> + ({k_3})x<sup>3</sup></math>
{/snippet}

<div class="mt-4 flex justify-center">
	<article class="prose lg:prose-xl">
		<h2>Backpropagation</h2>
		<p>
			There is one algorithm that unites the various algorithms in machine learning: <span
				class="text-green-400">Backpropagation</span
			>. This is the algorithm that enables <span class="text-blue-400">Neural Networks</span> to learn!
		</p>

		<p>
			The <span class="text-green-400">Backpropagation</span> algorithm was first applied to Neural
			Networks <a href="https://www.nature.com/articles/323533a0" target="_blank">in 1986</a>, when
			they were known as multi-layer perceptrons.
		</p>

		<h3>Intuition</h3>
		<p>
			Consider a graph with many points. Our goal is to find some function that will fit the best
			line possible to these points. It will be an approximation, but it will give us the best way
			to represent this line.
		</p>

		<div>
			<ScatterBackprop
				k_0={3}
				k_1={-2}
				k_2={3}
				k_3={-5}
				range={range(-3, 3, 0.25)}
				yMin={-200}
				yMax={200}
			/>
		</div>

		<p>
			Think of drawing some curvy line that will connect all of these dots. It is easy to do by
			hand, but how do we do it with math? This is called a "Curve Fitting Problem." The goal is to
			find some function <math>f(x)</math> that most closely represents the dots in this chart.
		</p>

		<h3>Polynomials</h3>
		<p>
			Polynomials are functions in math that combine terms of different degrees (think exponents!)
			with addition and subtraction. Each term has a coefficient that is some number (such as -2,
			-1, 0, 1, 2, etc.). This is a basic example of a polynomial:
		</p>

		<Mathjax math={basicPolynomial} />

		<p>And a more advanced one that has coefficients other than 1:</p>

		<Mathjax math={basicPolynomialCoefficients} />

		<p>
			Polynomials are useful in finding curves for complicated functions because we can combine the
			graph of each term in order to find a line for a more complicated graph.
		</p>

		<p>
			For example, here are the graphs for each term in a basic polynomial of degree 5, where the
			coefficient for each term is 1:
		</p>

		<div class=" flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = 1$$`} />
			</div>
			<div class="w-3/4">
				<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-5} yMax={5} exp={0} />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x$$`} />
			</div>
			<div class="w-3/4">
				<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-5} yMax={5} exp={1} />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^2$$`} />
			</div>
			<div class="w-3/4">
				<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-25} yMax={25} exp={2} />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^3$$`} />
			</div>
			<div class="w-3/4">
				<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-125} yMax={125} exp={3} />
			</div>
		</div>

		<p>
			We can generalize this to the following formula, where each <math>k</math> is a <Tooltip.Provider
			>
				<Tooltip.Root>
					<Tooltip.Trigger class="text-green-400 underline">Real Number</Tooltip.Trigger>
					<Tooltip.Content>
						<p>
							A <span class="text-green-400">Real Number</span> is any number that is on the number
							line.<br />
							This includes positive and negative numbers, 0, decimals, and fractions.<br /> It is often
							denoted as &#8477;.
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>on the number line:
		</p>

		<Mathjax math={generalPolynomial} />

		<h3>Finding Coefficients Randomly</h3>

		<p>
			The first thing we can try is to find all of the coefficients <math>k</math> randomly, tweaking
			each value manually to try and find the best curve. Let's see how this works by playing around
			with each of these values:
		</p>

		<div class="flex">
			<KInput index="0" bind:value={k_0} min={-10} max={10} />
			<KInput index="1" bind:value={k_1} min={-10} max={10} />
			<KInput index="2" bind:value={k_2} min={-5} max={5} />
			<KInput index="3" bind:value={k_3} min={-5} max={5} />
		</div>

		<div>
			<Card.Root class="mb-2">
				<Card.Header>
					<div class="flex justify-center">{@render polynomialStatement()}</div>
				</Card.Header>
				<Card.Content>
					<ScatterBackprop
						bind:k_0
						bind:k_1
						bind:k_2
						bind:k_3
						range={range(-3, 3, 0.25)}
						yMin={-200}
						yMax={200}
					/>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="grid grid-cols-2 gap-2">
			<div>
				<Card.Root class="mb-2">
					<Card.Header>
						<Card.Title><math>f(x) = k<sub>0</sub> = ({k_0})</math></Card.Title>
					</Card.Header>
					<Card.Content>
						<PolyChart
							bind:coefficient={k_0}
							range={range(-5, 5, 0.1)}
							yMin={-10}
							yMax={10}
							exp={0}
						/>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header>
						<Card.Title
							><math>f(x) = (k<sub>2</sub>)x<sup>2</sup> = ({k_2})x<sup>2</sup></math></Card.Title
						>
					</Card.Header>
					<Card.Content>
						<PolyChart
							bind:coefficient={k_2}
							range={range(-5, 5, 0.1)}
							yMin={-125}
							yMax={125}
							exp={2}
						/>
					</Card.Content>
				</Card.Root>
			</div>
			<div>
				<div>
					<Card.Root class="mb-2">
						<Card.Header>
							<Card.Title><math>f(x) = (k<sub>1</sub>)x = ({k_1})x</math></Card.Title>
						</Card.Header>
						<Card.Content>
							<PolyChart
								bind:coefficient={k_1}
								range={range(-5, 5, 0.1)}
								yMin={-50}
								yMax={50}
								exp={1}
							/>
						</Card.Content>
					</Card.Root>
					<Card.Root>
						<Card.Header>
							<Card.Title
								><math>f(x) = (k<sub>3</sub>)x<sup>3</sup> = ({k_3})x<sup>3</sup></math></Card.Title
							>
						</Card.Header>
						<Card.Content>
							<PolyChart
								bind:coefficient={k_3}
								range={range(-5, 5, 0.1)}
								yMin={-650}
								yMax={650}
								exp={3}
							/>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</div>
	</article>
</div>
