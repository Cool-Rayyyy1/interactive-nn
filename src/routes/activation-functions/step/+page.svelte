<script lang="ts">
	import Step from '$lib/components/charts/step.svelte';
	import sign_fn from '$lib/assets/sign_fn.svg';
</script>

<h1 class="m-2 text-lg font-extrabold">Step Function</h1>
<h2>
	One variation of a step function is the Sign function. This function takes in some value x, and
	assigns it a value. For example:
</h2>
<img class="m-2" alt="The Sign Function" src={sign_fn} />
<Step />
