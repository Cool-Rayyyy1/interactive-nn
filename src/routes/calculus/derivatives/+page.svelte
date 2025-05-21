<script lang="ts">
	import CalculusComposed from '$lib/components/charts/calculus-composed.svelte';
	import Mathjax from '$lib/mathjax/mathjax.svelte';

	let layers: number = $state(10);
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div id="what-is-an-activation-function">
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
				We can call the amount added to the radius with each layer {#key layers}<Mathjax
						math={`\\(dx\\)`}
					/>{/key} for the
				<span class="italic">difference in x</span>. For everytime the layers are increased by 1,
				{#key layers}<Mathjax math={`\\( dx = 1\\)`} />{/key}. This represents the change we are
				appling to the circle. In this case, our circle is represented as a triangle composed of the
				rectangules of the circle's rings.
			</div>
		</div>
	</article>
</div>
