<script lang="ts">
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
			<div class="m-2 p-2">
				<Math latex={step} />
			</div>
			<ActivationChart data={data.stepData} showDx={false} {keys} />
		</div>

		<div id="sigmoid">
			<h2>Sigmoid</h2>
			<div class="m-2 p-2">
				<Math latex={sigmoid} />
			</div>
			<ActivationChart data={data.sigmoidData} showDx={false} {keys} />
		</div>

		<div id="tanh">
			<h3>TanH</h3>
			<div class="m-2 p-2">
				<Math latex={tanh} />
			</div>
			<ActivationChart data={data.tanhData} showDx={false} {keys} />
		</div>

		<div id="relu">
			<h3>ReLU</h3>
			<div class="m-2 p-2">
				<Math latex={relu} />
			</div>
			<ActivationChart data={data.reluData} showDx={false} {keys} />
		</div>
	</article>
</div>
