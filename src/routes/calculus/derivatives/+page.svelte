<script lang="ts">
	import CalculusComposed from '$lib/components/charts/calculus-composed.svelte';
	import CalculusVelocity from '$lib/components/charts/calculus-velocity.svelte';
	import { Math } from 'svelte-math';

	let layers: number = $state(10);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<h2>Derivatives</h2>
		<div>
			Let us take a closer look at what happens when we add 1 more to the radius of our previous
			example, where we broke a circle up into groups of rings, and the unrolled those rings to
			rectangular shapes:
		</div>
		<div class="m-2">
			<CalculusComposed {layers} value={1} />
		</div>

		<div>
			We can call the amount added to the radius with each layer {#key layers}<Math
					latex={`dx`}
				/>{/key} for the
			<span class="italic">difference in x</span>. For everytime the layers are increased by 1,
			{#key layers}<Math latex={`dx = 1`} />{/key}. This represents the change we are appling to the
			circle. In this case, our circle is represented as a triangle composed of the rectangules of
			the circle's rings.
		</div>

		<div>
			How can we break down this problem into smaller pieces, just as we broke the circle into rings
			to find the area of a circle? Let's look at a more practicale example: cars. The below chart
			shows a car accelarating from a stop. As its speed goes up, the rate of distance it covers
			increases as well. This is shown by the <span class="text-blue-500">distance</span> line becoming
			steeper as the velocity increases.
		</div>

		<CalculusVelocity />

		<div>
			Let's think about how we can model this relationship. We know that if the car increases its
			velocity, it covers more distance. There is a direct relationship between speed and distance.
			In math terms, distance is a function of speed.
		</div>
	</article>
</div>
