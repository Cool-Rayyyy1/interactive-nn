<script lang="ts">
	import { Math } from 'svelte-math';
	import SimpleMinimum from '$lib/components/charts/simple-minimum.svelte';
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div id="gradient-descent">
			<h2>Gradient Descent</h2>
		</div>

		<div>
			<p>
				Gradient Descent is a way to improve an algorithm. In math, this is called <span
					class="text-green-400">optimization</span
				>. A goal with Neural Networks, and machine learning models in general, is to optimize them
				to improve their performance.
			</p>
		</div>

		<div>
			<p>
				When a neural network makes a prediction, a <span class="font-bold text-blue-400">loss</span
				> is calculated. This is a score that tells the network how well it is performing. The goal is
				to minimize this loss value and make it as small as possible. This is done in small steps many
				times. Visually, this looks like finding the lowest point on a graph:
			</p>
		</div>

		<div>
			<SimpleMinimum />
		</div>

		<p>
			This is like standing in a hilly area, and you are placed at a random spot. For every step you
			take, you take the steepest step you can downhill. You are done when you reach the lowest
			point and you can't go any lower!
		</p>

		<div>
			From calculus, the <span class="font-bold text-blue-400">Gradient</span>
			<Math latex={'\\nabla C(x, y)'} /> of a function gives the direction of steepest increase. In other
			words, this is the steepest way uphill. We want to find the lowest point, so we move the opposite
			way of the <span class="font-bold text-blue-400">Gradient</span>. This is just the negative of
			that value, which decreases the function most quickly to the minimum. So, our formula for
			finding the steepest decrease is thus <Math latex={'-\\nabla C(x, y)'} />. A Neural Network
			learns by making this value as small as possible!
		</div>

		<p>
			This value is then used to update the weights in the network, so that the inputs can be tuned
			to the right outputs. This is through a process called Backpropagation, which is the topic of
			the next chapter.
		</p>
	</article>
</div>
