<script lang="ts">
	import SimpleMinimum from '$lib/components/charts/simple-minimum.svelte';
</script>

<div class="mt-4 flex justify-center">
	<article class="prose lg:prose-xl">
		<h2>Calculus</h2>
		<p>
			Calculus is the study of continuous change. For example, it is the study of the change in a
			curved line, such as the below example:
		</p>

		<SimpleMinimum />

		Calculus, and areas of it like derivatives, are important to creating
		<span class="text-blue-400">Neural Networks</span>
		and enabling them to learn. To understand how a machine learning model can learn, we will first review
		the motivation behind calculus and what a derivative is, before applying these ideas to
		<span class="text-blue-400">Neural Networks</span>.

		<h3>Section Content</h3>
		<ul>
			<li><a href="/calculus/motivation">Motivation</a></li>
			<li><a href="/calculus/derivatives">Derivatives</a></li>
			<li>
				<a href="/calculus/derivatives-of-activation-functions"
					>Derivatives of Activation Functions</a
				>
			</li>
			<li><a href="/calculus/gradient-descent">Gradient Descent</a></li>
			<li><a href="/calculus/backpropagation">Backpropagation</a></li>
		</ul>
	</article>
</div>
