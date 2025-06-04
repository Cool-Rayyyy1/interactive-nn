<script lang="ts">
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import SingleLayerPerceptron from '$lib/components/perceptrons/single-layer-perceptron.svelte';
	import { setNetworkContext } from '$lib/context';
	import { SingleLayerOneInputNetwork } from '$lib/networks/single-layer-one-input';
	import type { Network, SeriesData } from '$lib/types';
	import { networkValue2d } from '$lib/utils';

	const keys = ['activation'];

	let network: Network = $state(SingleLayerOneInputNetwork);

	let data: SeriesData[] = $derived.by(() => {
		return networkValue2d(network).map(
			(val): SeriesData =>
				<SeriesData>{
					input: val.input,
					activation: val.output,
					derivative: 0
				}
		);
	});

	setNetworkContext(network);
</script>

<div class="flex w-full justify-center">
	<div class="mt-4 flex max-w-prose flex-col justify-center">
		<article class="prose lg:prose-xl">
			<h2>One Dimension Perceptron with One Layer</h2>
			<p>This example is a Perceptron with one layer and one input dimension.</p>
			<p>
				It uses a <a href="/activation-functions#step">Step</a> function by default. Experiment with
				the values!
			</p>
		</article>

		<div class="m-2">
			<ActivationChart {data} showDx={false} {keys} />
		</div>
		<div style:height="500px" class="border-2">
			<SingleLayerPerceptron />
		</div>
	</div>
</div>
