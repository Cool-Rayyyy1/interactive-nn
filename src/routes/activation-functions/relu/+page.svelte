<script lang="ts">
	import relu_fn from '$lib/assets/relu_fn.svg';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
	import { ActivationFunction } from '$lib/types';
</script>

<h1 class="m-2 text-lg font-extrabold">ReLU</h1>
<img class="m-2" alt="The Sign Function" src={relu_fn} />
<ActivationChart start={-5} end={5} step={0.1} activation={ActivationFunction.ReLU} />
