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
	<article class="prose lg:prose-xl max-w-4xl space-y-10">
		<!-- INTRO -->
		<section class="space-y-4">
			<h1>Motivation</h1>

			<p>
				To motivate the study of Calculus, let's first review circles.
			</p>

			<div class="rounded-2xl border bg-slate-50 p-6">
				<p>
					We know the area of a circle is
					<Math latex={'\\pi r^2'} />.
				</p>

				<p class="mb-0">
					But where does this formula come from?
				</p>
			</div>

			<p>
				To solve difficult problems, we often break them into many
				smaller and simpler pieces.
			</p>

			<div>
				Consider a circle with radius
				<Math latex={`r = ${layers}`} />.
			</div>

			<div class="rounded-xl border bg-slate-50 p-4">
				<div class="flex justify-center text-lg">
					<Math
						latex={`A = \\pi r^2 = \\pi(${layers})^2 = ${(layers ** 2 * PI).toFixed(2)}`}
					/>
				</div>
			</div>
		</section>

		<!-- CIRCLE -->
		<section class="space-y-4">
			<div class="m-2 flex justify-center">
				<CalculusCircle layers={1} value={layers} />
			</div>

			<p>
				It is difficult to directly understand the area of a circle.
			</p>

			<p>
				Instead, let's break the circle into many thin rings.
			</p>
		</section>

		<!-- RINGS -->
		<section class="space-y-4">
			<h2>Breaking the Circle into Rings</h2>

			<div class="m-2 flex justify-center">
				<CalculusCircle layers={10} value={1} />
			</div>

			<p>
				Each ring represents a small part of the circle.
			</p>

			<p>
				Now imagine unrolling each ring into a rectangle.
			</p>
		</section>

		<!-- BARS -->
		<section class="space-y-4">
			<h2>Turning Rings into Rectangles</h2>

			<div class="rounded-xl border bg-slate-50 p-4">
				<p>
					The <span class="text-green-500 font-medium">green</span>
					bars represent the area of each ring.
				</p>

				<p class="mb-0">
					The <span class="text-blue-500 font-medium">blue</span>
					shape represents the total area built from all the rings together.
				</p>
			</div>

			<div class="m-2">
				<CalculusBars layers={10} value={1} />
			</div>

			<p>
				Notice that the bars begin to resemble a triangle.
			</p>

			<div class="flex items-center gap-3 rounded-xl border bg-slate-50 p-4 w-fit">
				<label for="layers" class="font-medium">
					Number of Rings
				</label>

				<input
					id="layers"
					bind:value={layers}
					type="number"
					class="w-20 rounded border border-slate-300 px-2 py-1"
					min={1}
					max={50}
				/>
			</div>

			<p>
				As the number of rings increases, the shape looks more and more
				like a smooth triangle.
			</p>
		</section>

		<!-- COMPOSED -->
		<section class="space-y-4">
			<h2>Forming a Triangle</h2>

			<div class="m-2">
				<CalculusComposed {layers} {value} />
			</div>

			<p>
				The base of this triangle is the radius
				<Math latex={'r'} />,
				and the height is the circumference
				<Math latex={'2\\pi r'} />.
			</p>

			<div class="rounded-xl border bg-slate-50 p-6">
				<p>
					The area of a triangle is:
				</p>

				<div class="flex justify-center text-xl">
					<Math latex={'\\frac{1}{2} \\times base \\times height'} />
				</div>
			</div>
		</section>

		<!-- EXAMPLE -->
		<section class="space-y-4">
			<h2>Example Calculation</h2>

			<div class="rounded-2xl border bg-slate-50 p-6 space-y-4">
				<p>
					In this example:
				</p>

				<ul>
					<li>
						Radius:
						<Math latex={`r = 10`} />
					</li>

					<li>
						Circumference:
						<Math latex={`2\\pi r = 2\\pi(10) = 62.83`} />
					</li>
				</ul>

				<p>
					Using the triangle area formula:
				</p>

				<div class="flex justify-center text-xl">
					<Math
						latex={`\\frac{1}{2} \\times 10 \\times 62.83 = 314.16`}
					/>
				</div>

				<p class="mb-0">
					This matches the area of the circle.
				</p>
			</div>

			<div class="m-2">
				<TriangleAreaChart />
			</div>
		</section>

		<!-- CONCLUSION -->
		<section class="space-y-4">
			<h2>Conclusion</h2>

			<div class="rounded-2xl border bg-slate-50 p-6">
				<p>
					By breaking a circle into many smaller pieces,
					we transformed a difficult problem into a simpler one.
				</p>

				<p class="mb-0">
					This idea of breaking complex problems into tiny parts
					is one of the central ideas behind Calculus.
				</p>
			</div>
		</section>
	</article>
</div>