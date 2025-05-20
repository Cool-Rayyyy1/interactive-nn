<script lang="ts">
	import CalculusBars from '$lib/components/charts/calculus-bars.svelte';
	import CalculusCircle from '$lib/components/charts/calculus-circle.svelte';
	import CalculusComposed from '$lib/components/charts/calculus-composed.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';

	let layers: number = $state(10);
	let value: number = $state(1);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div>
			<h2>Motivation</h2>
			<p>To motivate the study of Calculus, let's first review circles.</p>
			<div>
				We know the area of a circle is equal to <Mathjax math={'\\(\\pi r^2\\)'}></Mathjax>. But
				how do we find that formula? What is the intuition that can lead us to deriving this
				formula?
			</div>
			<p>
				To solve hard problems like this one, the first step is to break it down into smaller,
				easier problems.
			</p>
			<div>
				Consider a normal circle, with radius
				{#key layers}
					<Mathjax math={`\\(r = 10\\)`}></Mathjax>{/key}
			</div>
			<div>
				Therefore, its formula is {#key layers}
					<Mathjax math={`\\(\\pi(${layers})^2\\) = ${(layers ** 2 * Math.PI).toFixed(2)}`}
					></Mathjax>{/key}
			</div>
		</div>

		<div class="m-2">
			<CalculusCircle layers={1} value={layers} />
		</div>

		<p>
			It is hard to figure out the area of a circle without breaking the problem down further. Let's
			try turning a circle into a series of rings:
		</p>

		<div class="m-2">
			<CalculusCircle layers={10} value={1} />
		</div>

		Each of these rings can be unravelled into their own bar, and plotted in a bar chart. The
		<span class="text-green-500">green</span>
		is the area of a ring, and the <span class="text-blue-500">blue</span> is the cumulative area of
		the circle up until that point. What shape do these bars resemble?

		<div class="m-2">
			<CalculusBars layers={10} value={1} />
		</div>

		It resembles a triangle! Try adjusting the number of layers with the input:

		<input bind:value={layers} type="number" class="w-20 border border-black" min={1} max={50} />

		Notice that the more layers there are in the unrolled circle rings, the more the bars start to
		resemble a triangle! And we know that the area of a triangle is <Mathjax
			math={`\\(\\frac{1}{2}*base*height\\)`}
		/>. Here, our base is <span class="italic">x</span>, for the number of rings in our circle, and
		the height is the combined area of all the rings, which is the area of the circle.
		<div class="m-2">
			<CalculusComposed {layers} {value} />
		</div>

		We can call the amount added added <Mathjax math={`\\(dx\\)`} /> for the
		<span class="italic">difference in x</span>. For everytime the layers are increased by 1,
		<Mathjax math={`\\(dx = 1\\)`} />.
	</article>
</div>
