<script lang="ts">
	import tanh_fn from '$lib/assets/tanh_fn.svg';
	import { ActivationFunction } from '$lib/types';
	import ActivationChart from '$lib/components/charts/activation-chart.svelte';
</script>

<h1 class="m-2 text-lg font-extrabold">Tanh</h1>
<img class="m-2" alt="The Sign Function" src={tanh_fn} />
<ActivationChart start={-5} end={5} step={0.1} activation={ActivationFunction.Tanh} />
