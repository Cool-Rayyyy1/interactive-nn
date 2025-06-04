<script lang="ts">
	import PolyConst from '$lib/components/charts/poly-const.svelte';
	import PolyFive from '$lib/components/charts/poly-five.svelte';
	import PolyFour from '$lib/components/charts/poly-four.svelte';
	import PolyOne from '$lib/components/charts/poly-one.svelte';
	import PolyThree from '$lib/components/charts/poly-three.svelte';
	import PolyTwo from '$lib/components/charts/poly-two.svelte';
	import ScatterBackprop from '$lib/components/charts/scatter-backprop.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import KInput from '$lib/components/inputs/k-input.svelte';

	let k_0 = $state(0);
	let k_1 = $state(0);
	let k_2 = $state(0);
	let k_3 = $state(0);
	let k_4 = $state(0);
	let k_5 = $state(0);

	const basicPolynomial: string = `$$
x^3 + x^2 + x + 1
$$`;

	const basicPolynomialCoefficients: string = `$$
4x^3 - 2x^2 + 7x + 8
$$`;

	const generalPolynomial: string = `$$
f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3 + k_4 x^4 + k_5 x^4
$$`;

	$inspect(k_0);
</script>

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
			<ScatterBackprop />
		</div>

		<p>
			Think of drawing some curvy line that will connect all of these dots. It is easy to do by
			hand, but how do we do it with math? This is called a "Curve Fitting Problem." The goal is to
			find some function <Mathjax math={'\\(f(x)\\)'} /> that most closely represents the dots in this
			chart.
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
				<PolyConst />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x$$`} />
			</div>
			<div class="w-3/4">
				<PolyOne />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^2$$`} />
			</div>
			<div class="w-3/4">
				<PolyTwo />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^3$$`} />
			</div>
			<div class="w-3/4">
				<PolyThree />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^4$$`} />
			</div>
			<div class="w-3/4">
				<PolyFour />
			</div>
		</div>

		<div class="mt-2 flex w-full">
			<div class="w-1/4">
				<Mathjax math={`$$f(x) = x^5$$`} />
			</div>
			<div class="w-3/4">
				<PolyFive />
			</div>
		</div>

		<p>
			We can generalize this to the following formula, where each <Mathjax math={'\\(k\\)'} /> is a <Tooltip.Provider
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
			The first thing we can try is to find all of the coefficients <Mathjax math={'\\(k\\)'} /> randomly,
			tweaking each value manually to try and find the best curve. Let's see how this works by playing
			around with each of these values:
		</p>

		<div class="flex">
			<KInput index="0" value={k_0} />
			<KInput index="1" value={k_1} />
			<KInput index="2" value={k_2} />
			<KInput index="3" value={k_3} />
			<KInput index="4" value={k_4} />
			<KInput index="5" value={k_5} />
		</div>

		{#key k_0}
			<Mathjax
				math={`$$
f(x) = ${k_0} + k_1 x + k_2 x^2 + k_3 x^3 + k_4 x^4 + k_5 x^4
$$`}
			/>
		{/key}
	</article>
</div>
