<script lang="ts">
	import Sigmoid from '$lib/components/charts/sigmoid.svelte';
	import sigmoid_fn from '$lib/assets/sigmoid_fn.svg';
</script>

<h1 class="m-2 text-lg font-extrabold">Sigmoid</h1>
<img class="m-2" alt="The Sign Function" src={sigmoid_fn} />
<Sigmoid />
