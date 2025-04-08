<script lang="ts">
	import Relu from '$lib/components/charts/relu.svelte';
	import relu_fn from '$lib/assets/relu_fn.svg';
</script>

<h1 class="m-2 text-lg font-extrabold">ReLU</h1>
<img class="m-2" alt="The Sign Function" src={relu_fn} />
<Relu />
