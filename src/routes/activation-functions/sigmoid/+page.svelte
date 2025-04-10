<script lang="ts">
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
	import { ActivationFunction } from '$lib/types';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
</script>

<h1 class="m-2 text-lg font-extrabold">Sigmoid</h1>
<img class="m-2" alt="The Sign Function" src={sigmoid_fn} />
<ActivationChart start={-5} end={5} step={0.1} activation={ActivationFunction.Sigmoid} />
