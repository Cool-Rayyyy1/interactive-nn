<script lang="ts">
	import CalculusBars from '$lib/components/charts/calculus-bars.svelte';
	import CalculusCircle from '$lib/components/charts/calculus-circle.svelte';
	import CalculusComposed from '$lib/components/charts/calculus-composed.svelte';
	import TriangleAreaChart from '$lib/components/charts/triangle-area-chart.svelte';
	import { PI } from '$lib/math/constants';
	import { Math } from 'svelte-math';

	let layers: number = $state(10);
	let value: number = $state(1);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div>
			<h2>Motivation</h2>
			<p>To motivate the study of Calculus, let's first review circles.</p>
			<div>
				We know the area of a circle is equal to <Math latex={'\\pi r^2'} />. But how do we find
				that formula? What is the intuition that can lead us to deriving this formula?
			</div>
			<p>
				To solve hard problems like this one, the first step is to break it down into smaller,
				easier problems.
			</p>
			<div>
				Consider a normal circle, with radius
				<Math latex={`r = 10`} />
			</div>
			<div>
				Therefore, its formula is
				<Math latex={`\\pi(${layers})^2 = ${(layers ** 2 * PI).toFixed(2)}`} />.
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
		resemble a triangle! And we know that the area of a triangle is <Math
			latex={`\\frac{1}{2}*base*height`}
		/>. Here, our base is <span class="italic">x</span>, for the number of rings in our circle, and
		the height is the combined area of all the rings, which is the area of the circle.
		<div class="m-2">
			<CalculusComposed {layers} {value} />
		</div>

		<div>
			In this example, we have a base <Math latex={`x = 10`} />, which is the radius in th example.
			We have 10 rings of width 1. We also know that the height of each of the rings is equal to the
			circumference of the circle at that point, so <Math
				latex={`2 \\pi r = 2\\pi (10) = 62.83`}
			/>. We can now use these values to find the area of a triangle <Math
				latex={`\\frac{1}{2}*10* 62.83 = 314.16 `}
			/> which matches the value from our graph!
		</div>

		<TriangleAreaChart />

		<div class="mt-2">
			We can generalize this insight. If we turn the area of a circle into a rings, then unroll
			those rings into rectangular shapes, we can easily find the area of each rectangle. If we
			align each of these rectangles side by side, they start to resemble a triangle. The base of
			this triangle is the radius, and the height is the circumference. And for a triangle, we want
			half of that area. So, together, that combines to <Math
				latex={`\\frac{1}{2} * \\pi * r * r =  \\frac{1}{2} * \\pi * r^2 `}
			/>, which is the formula for the area of the triangle.
		</div>
	</article>
</div>
