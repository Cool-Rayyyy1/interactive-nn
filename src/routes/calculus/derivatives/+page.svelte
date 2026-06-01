<script lang="ts">
	import CalculusComposed from '$lib/components/charts/calculus-composed.svelte';
	import CalculusVelocity from '$lib/components/charts/calculus-velocity.svelte';
	import { Math } from 'svelte-math';

	let layers: number = $state(10);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl max-w-4xl space-y-10">
		<!-- INTRO -->
		<section class="space-y-4">
			<h1>Derivatives</h1>

			<p>
				Let us take a closer look at what happens when we add
				1 more layer to the radius of our previous example.
			</p>

			<p>
				Previously, we broke a circle into rings and unrolled
				those rings into rectangular shapes.
			</p>
		</section>

		<!-- GRAPH -->
		<section class="space-y-4">
			<div class="m-2">
				<CalculusComposed {layers} value={1} />
			</div>

			<div class="rounded-xl border bg-slate-50 p-4">
				<p class="mb-0">
					Each additional layer slightly increases the radius
					of the circle.
				</p>
			</div>
		</section>

		<!-- DX -->
		<section class="space-y-4">
			<h2>Understanding Small Changes</h2>

			<p>
				We call the amount added to the radius
				<Math latex={'dx'} />,
				which means a small change in
				<Math latex={'x'} />.
			</p>

			<div class="rounded-2xl border bg-slate-50 p-6">
				<div class="flex justify-center text-2xl">
					<Math latex={'dx = 1'} />
				</div>
			</div>

			<p>
				Every time the number of layers increases by 1,
				the radius also increases by
				<Math latex={'dx = 1'} />.
			</p>

			<p>
				In Calculus, derivatives help us understand how much
				something changes when we slightly change the input.
			</p>
		</section>

		<!-- CAR EXAMPLE -->
		<section class="space-y-4">
			<h2>A Practical Example</h2>

			<p>
				Let's look at a more practical example: cars.
			</p>

			<p>
				The chart below shows a car accelerating from a stop.
			</p>

			<div class="rounded-xl border bg-slate-50 p-4">
				<p>
					As the velocity increases,
					the car covers more distance over time.
				</p>

				<p class="mb-0">
					This is shown by the
					<span class="text-blue-500 font-medium">distance</span>
					line becoming steeper.
				</p>
			</div>

			<CalculusVelocity />
		</section>

		<!-- CONNECTION -->
		<section class="space-y-4">
			<h2>Connecting Velocity and Distance</h2>

			<p>
				If the car moves faster,
				it travels more distance.
			</p>

			<p>
				This means there is a relationship between
				speed and distance.
			</p>

			<div class="rounded-2xl border bg-slate-50 p-6">
				<p class="mb-0">
					Derivatives help us measure how quickly one quantity
					changes compared to another.
				</p>
			</div>
		</section>
	</article>
</div>