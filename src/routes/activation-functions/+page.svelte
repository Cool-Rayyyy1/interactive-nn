<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { step, sigmoid, tanh, relu } from '$lib/math/latex';
	import { Math } from 'svelte-math';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const keys = ['activation'];
</script>

<div class="flex justify-center">
	<article class="prose lg:prose-xl">
		<div id="what-is-an-activation-function">
			<h2>What is an Activation Function?</h2>
			<p>Activation functions are non-linear transformations.</p>
			<p>An Activation Function applies a non-linear transformation to some weighted input.</p>
		</div>

		<div id="step">
			<h3>Step</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center">
					<Math latex={step} />
				</Card.Root>
				<ActivationChart data={data.stepData} showDx={false} {keys} />
			</div>
		</div>

		<div id="sigmoid">
			<h2>Sigmoid</h2>
			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center">
					<Math latex={sigmoid} />
				</Card.Root>
				<ActivationChart data={data.sigmoidData} showDx={false} {keys} />
			</div>
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center">
					<Math latex={tanh} />
				</Card.Root>
				<ActivationChart data={data.tanhData} showDx={false} {keys} />
			</div>
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<div class="grid grid-cols-1 gap-y-2">
				<Card.Root class="flex items-center">
					<Math latex={relu} />
				</Card.Root>
				<ActivationChart data={data.reluData} showDx={false} {keys} />
			</div>
		</div>
	</article>
</div>
