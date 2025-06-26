<script lang="ts">
	import ScatterBackprop from '$lib/components/charts/scatter-backprop.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import KInput from '$lib/components/inputs/k-input.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { range } from '$lib/utils';
	import PolyChart from '$lib/components/charts/poly-chart.svelte';
	import ScatterLineComposedBackprop from '$lib/components/charts/scatter-line-composed-backprop.svelte';
	import ScatterLineComposedBackpropAnnotated from '$lib/components/charts/scatter-line-composed-backprop-annotated.svelte';
	import ScatterBackpropFiveTerms from '$lib/components/charts/scatter-backprop-five-terms.svelte';
	import { untrack } from 'svelte';
	import LossPlot from '$lib/components/charts/loss-plot.svelte';

	const OFFSET = 0.0001;

	interface Data {
		x: number;
		y: number;
		x_prime: number;
		y_prime: number;
	}

	let k_0 = $state(1);
	let k_1 = $state(1);
	let k_2 = $state(1);
	let k_3 = $state(1);

	let k_1_min: number = $state(1);
	let k_1_min_prime: number = $derived(k_1_min + OFFSET);

	let k_1_data: Data[] = $state([]);

	let loss = $state(0);
	let min_loss = $state(0);
	let min_loss_prime = $state(0);

	$effect(() => {
		const x = k_1_min;
		const y = min_loss;

		const x_prime = k_1_min_prime;
		const y_prime = min_loss_prime;

		const point: Data = { x, y, x_prime, y_prime };

		untrack(() => {
			if (!k_1_data.some((obj) => obj.x === point.x)) {
				k_1_data.filter((obj) => obj.x === point.x);
				k_1_data.push({ x, y, x_prime, y_prime });
			}
			k_1_data.filter((obj) => obj.y == 0);
			k_1_data.sort((a, b) => a.x - b.x);
		});
	});

	const basicPolynomial: string = `$$x^3 + x^2 + x + 1$$`;

	const basicPolynomialCoefficients: string = `$$2x^3 - 2x^2 + 7x + 8$$`;

	const generalPolynomial: string = `$$f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3$$`;

	const fiveTermPolynomial: string = `$$f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3 + k_4 x^4 + k_5 x^5$$`;

	const mse: string = `$$\\text{Mean Squared Error (MSE)} = \\frac{\\sum_{i=1}^{n}{f(x_i)}}{n}$$`;

	const stepSize: string = `$$\\text{Learning Rate} = \\eta$$
$$\\text{Step Size} = f'(x) \\times \\eta$$`;
</script>

<div class="mt-4 flex justify-center">
	<article class="prose lg:prose-xl">
		<h2>Backpropagation</h2>

		<div>
			There is one algorithm that unites the various algorithms in machine learning: <span
				class="text-green-400">Backpropagation</span
			>. This is the algorithm that enables <span class="text-blue-400">Neural Networks</span> to learn!
		</div>

		<div>
			The <span class="text-green-400">Backpropagation</span> algorithm was first applied to Neural
			Networks <a href="https://www.nature.com/articles/323533a0" target="_blank">in 1986</a>, when
			they were known as multi-layer perceptrons.
		</div>

		<h3>Intuition</h3>

		<div class="mb-2">
			Consider a graph with many points. Our goal is to find some function that will fit the best
			line possible to these points. It will be an approximation, but it will give us the best way
			to represent this line.
		</div>

		<Card.Root>
			<Card.Content>
				<ScatterBackprop
					k_0={3}
					k_1={-2}
					k_2={3}
					k_3={-5}
					range={range(-3, 3.25, 0.25)}
					yMin={-200}
					yMax={200}
					noise={true}
				/>
			</Card.Content>
		</Card.Root>

		<div class="mt-2">
			Think of drawing some curvy line that will connect all of these dots. It is easy to do by
			hand, but how do we do it with math? This is called a "Curve Fitting Problem." The goal is to
			find some function <Mathjax math={'\\(f(x)\\)'}></Mathjax> that most closely represents the dots
			in this chart.
		</div>

		<h3>Polynomials</h3>

		<div class="mb-2">
			Polynomials are functions in math that combine terms of different degrees (think exponents!)
			with addition and subtraction. Each term has a coefficient that is some number (such as -2,
			-1, 0, 1, 2, etc.). This is a basic example of a polynomial:
		</div>

		<Card.Root class="mb-2">
			<Card.Header>
				<Card.Title>
					<Mathjax math={basicPolynomial} />
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<ScatterBackprop
					k_0={1}
					k_1={1}
					k_2={1}
					k_3={1}
					range={range(-3, 3.25, 0.25)}
					yMin={-100}
					yMax={100}
					noise={false}
				/>
			</Card.Content>
		</Card.Root>

		<div class="mb-4 mt-4">And a more advanced one that has coefficients other than 1:</div>

		<Card.Root class="mb-2">
			<Card.Header>
				<Card.Title>
					<Mathjax math={basicPolynomialCoefficients} />
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<ScatterBackprop
					k_0={8}
					k_1={7}
					k_2={-2}
					k_3={2}
					range={range(-3, 3.25, 0.25)}
					yMin={-100}
					yMax={100}
					noise={false}
				/>
			</Card.Content>
		</Card.Root>

		<div class="mt-4">
			Polynomials are useful in finding curves for complicated functions because we can combine the
			graph of each term in order to find a line for a more complicated graph.
		</div>

		<div class="mb-4 mt-2">
			For example, here are the graphs for each term in a basic polynomial of degree 5, where the
			coefficient for each term is 1:
		</div>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class=" flex w-full">
					<div class="w-1/4">
						<Mathjax math={`$$f(x) = 1$$`} />
					</div>
					<div class="w-3/4">
						<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-5} yMax={5} exp={0} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class="mt-2 flex w-full">
					<div class="w-1/4">
						<Mathjax math={`$$f(x) = x$$`} />
					</div>
					<div class="w-3/4">
						<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-5} yMax={5} exp={1} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class="mt-2 flex w-full">
					<div class="w-1/4">
						<Mathjax math={`$$f(x) = x^2$$`} />
					</div>
					<div class="w-3/4">
						<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-25} yMax={25} exp={2} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content>
				<div class="mt-2 flex w-full">
					<div class="w-1/4">
						<Mathjax math={`$$f(x) = x^3$$`} />
					</div>
					<div class="w-3/4">
						<PolyChart coefficient={1} range={range(-5, 5, 0.1)} yMin={-125} yMax={125} exp={3} />
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<div>
			We can generalize this to the following formula, where each <Mathjax math={'\\(k\\)'}
			></Mathjax> is a <Tooltip.Provider>
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
		</div>

		<Card.Root>
			<Card.Content>
				<Mathjax math={generalPolynomial} />
			</Card.Content>
		</Card.Root>

		<h3>Finding Coefficients Randomly</h3>

		<div>
			The first thing we can try is to find all of the coefficients <Mathjax math={'\\(k\\)'}
			></Mathjax> randomly, tweaking each value manually to try and find the best curve. Let's see how
			this works by playing around with each of these values:
		</div>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class="flex">
					<KInput index="0" bind:value={k_0} min={-10} max={10} disabled={false} />
					<KInput index="1" bind:value={k_1} min={-10} max={10} disabled={false} />
					<KInput index="2" bind:value={k_2} min={-5} max={5} disabled={false} />
					<KInput index="3" bind:value={k_3} min={-5} max={5} disabled={false} />
				</div>
			</Card.Content>
		</Card.Root>

		<div>
			<Card.Root class="mb-2">
				<Card.Header>
					<Card.Title>
						<math>f(x) = {k_0} + ({k_1})x + ({k_2})x<sup>2</sup> + ({k_3})x<sup>3</sup></math>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ScatterLineComposedBackprop
						bind:k_0
						bind:k_1
						bind:k_2
						bind:k_3
						dataRange={range(-3, 3.25, 0.25)}
						yMin={-200}
						yMax={200}
						noise={true}
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

		<h3>Loss Function</h3>

		<div>
			One issue is knowing when exactly the best curve has been found, as many curves look about
			correct. This is what a <span class="text-green-400">Loss Function</span> tells us.
		</div>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class="flex">
					<KInput index="0" bind:value={k_0} min={-10} max={10} disabled={false} />
					<KInput index="1" bind:value={k_1} min={-10} max={10} disabled={false} />
					<KInput index="2" bind:value={k_2} min={-5} max={5} disabled={false} />
					<KInput index="3" bind:value={k_3} min={-5} max={5} disabled={false} />
				</div>
			</Card.Content>
		</Card.Root>

		<div>
			<Card.Root class="mb-2">
				<Card.Header class="flex justify-center">
					<Card.Title>
						<div class="flex justify-center">
							<math>f(x) = {k_0} + ({k_1})x + ({k_2})x<sup>2</sup> + ({k_3})x<sup>3</sup></math>
						</div>
					</Card.Title>
					<div class="flex justify-center"><math>Total Loss: {loss.toFixed(2)}</math></div>
				</Card.Header>
				<Card.Content>
					<ScatterLineComposedBackpropAnnotated
						bind:k_0
						bind:k_1
						bind:k_2
						bind:k_3
						dataRange={range(-3, 3.25, 0.25)}
						yMin={-200}
						yMax={200}
						noise={true}
						bind:loss
						lossPrime={0}
					/>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			This loss is calculated using <a
				href="https://en.wikipedia.org/wiki/Mean_squared_error"
				target="_blank">Mean Squared Error</a
			>. This Loss Function sums the squared value of each error (the difference between the actual
			point and the predicted point on the curve), and then it divides it by the total number of
			points to get the mean.
		</div>

		<Card.Root>
			<Card.Content>
				<Mathjax math={mse} />
			</Card.Content>
		</Card.Root>

		<div>
			As the curve gets closer and closer to fitting the points, the Loss gets closer to 0. The goal
			is to make this Loss as small as possible! Try to find values <Mathjax math={'\\(k\\)'}
			></Mathjax> that have a Loss of less than 50.
		</div>

		<div>
			While it is possible to find good <Mathjax math={'\\(k\\)'}></Mathjax> values with low loss when
			fitting the curve manually, how can we be sure this is the best possible curve and the lowest possible
			Loss? What if we have a complicated five-term polynomial that we are trying to fit a curve to:
		</div>

		<Card.Root class="mb-2">
			<Card.Content>
				<Mathjax math={fiveTermPolynomial} />
			</Card.Content>
		</Card.Root>

		<Card.Root class="mb-2">
			<Card.Content>
				<ScatterBackpropFiveTerms />
			</Card.Content>
		</Card.Root>

		<div>
			This is where our tools like Derivatives and Gradient Descent become very important and
			useful!
		</div>

		<h3>Finding Minimum Loss in One Dimension</h3>

		<div>
			Let's start by focusing only on <Mathjax math={'\\(k_1\\)'}></Mathjax>, and keeping
			<Mathjax math={'\\(k_0\\)'}></Mathjax>, <Mathjax math={'\\(k_2\\)'}></Mathjax>, and <Mathjax
				math={'\\(k_3\\)'}
			></Mathjax> fixed. For every <Mathjax math={'\\(k_1\\)'}></Mathjax> value tried, it's corresponding
			loss will be plotted.
		</div>

		<Card.Root class="mb-2">
			<Card.Content>
				<div class="flex">
					<KInput index="0" value={3} min={-10} max={10} disabled={true} />
					<KInput index="1" bind:value={k_1_min} min={-10} max={10} disabled={false} />
					<KInput index="2" value={3} min={-5} max={5} disabled={true} />
					<KInput index="3" value={-5} min={-5} max={5} disabled={true} />
				</div>
			</Card.Content>
		</Card.Root>

		<div>
			<Card.Root class="mb-2">
				<Card.Header class="flex justify-center">
					<Card.Title>
						<div class="flex justify-center">
							<math>f(x) = 3 - (22)x + (2)x<sup>2</sup> + (-5)x<sup>3</sup></math>
						</div>
						<div>{min_loss.toFixed(2)}</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ScatterLineComposedBackpropAnnotated
						k_0={3}
						bind:k_1={k_1_min}
						k_2={3}
						k_3={-5}
						dataRange={range(-3, 3.25, 0.25)}
						yMin={-200}
						yMax={200}
						noise={true}
						bind:loss={min_loss}
						bind:lossPrime={min_loss_prime}
					/>
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			<Card.Root class="mb-2">
				<Card.Header class="flex justify-center">
					<Card.Title>
						<div class="flex justify-center">
							<math>k<sub>1</sub> Plotted Against Loss </math>
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<LossPlot data={k_1_data} showDerivative={false} />
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			We can see clearly from this example that <math>k<sub>1</sub></math> has the lowest loss when
			<math>k<sub>1</sub> = -2</math>, but only when <math>k<sub>0</sub> = 3</math>,
			<math>k<sub>2</sub> = 3</math>, and <math>k<sub>3</sub> = -5</math>.
		</div>

		<div>
			To help us know if we should increase or decrease <Mathjax math={'\\(k_1\\)'}></Mathjax> for our
			next guess, we can take the derivative of that point. The slope of this derivative tells us if
			our next guess for <Mathjax math={'\\(k_1\\)'}></Mathjax> should be bigger or smaller:
		</div>

		<div>
			<Card.Root class="mb-2">
				<Card.Header class="flex justify-center">
					<Card.Title>
						<div class="flex justify-center font-normal">
							<Mathjax math={'\\(k_1\\)'}></Mathjax> Plotted Against Loss with Derivatives
						</div>
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<LossPlot data={k_1_data} showDerivative={true} />
				</Card.Content>
			</Card.Root>
		</div>

		<div>
			Now we can make smarter predictions! If the derivative is negative, we want to make our next
			guess to the right - a bigger number <Mathjax math={'\\(k_1\\)'}></Mathjax>. If it's positive,
			we want make our next guess to the left - a smaller number <Mathjax math={'\\(k_1\\)'}
			></Mathjax>. Review the derivatives of the points in the above graph to check your
			understanding. We know that we have reached the minimum loss when the derivative is 0, and
			that is when we stop checking new values
			<Mathjax math={'\\(k_1\\)'}></Mathjax>!
		</div>

		<h3>Minimum Loss with Multiple Dimensions</h3>

		<!-- TODO: Show example of computing gradients with partial derivatives for 2d, then explain how it extends to nd  -->

		<h3>Putting the Pieces Together</h3>

		<div>
			These are all the components of <span class="text-green-400">Gradient Descent</span>!. The one
			additional piece is to know how much bigger or smaller the <Mathjax math={'\\(k_1\\)'}
			></Mathjax> guess should be. This difference between the last guess and the next one is called
			the
			<span class="text-blue-400">Step Size</span>.
			<span class="text-blue-400">Step Size</span>
			is found by multiplying the slope by a value called the
			<span class="text-blue-400">Learning Rate</span>, which is chosen by the researcher and
			controls how big the steps are. The <span class="text-blue-400">Learning Rate</span> is usually
			denoted by the lowercase Greek letter Eta &eta;.
		</div>

		<div>
			We want to choose a value that's big enough that our guesses quickly move downhill, but not
			too big that they jump past the minimum.
		</div>

		<Card.Root>
			<Card.Content>
				<Mathjax math={stepSize} />
			</Card.Content>
		</Card.Root>

		<div>
			By multiplying the derivative of the output by some fixed <span class="text-blue-400"
				>Learning Rate</span
			> &eta; value, we take smaller and smaller steps as we get closer to the minimum.
		</div>
	</article>
</div>
