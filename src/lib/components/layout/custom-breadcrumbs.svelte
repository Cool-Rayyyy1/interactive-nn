<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { page } from '$app/state';

	type LookupMap = {
		[key: string]: BreadcrumbObject;
	};

	type BreadcrumbObject = { segment: string; path: string };

	let lookup: LookupMap = {
		'getting-started': { segment: 'Getting Started', path: '/getting-started' },
		'what-is-a-neural-network': {
			segment: 'What is a Neural Network?',
			path: '/getting-started/what-is-a-neural-network'
		},
		neurons: { segment: 'Neurons', path: '/getting-started/neurons' },
		inputs: { segment: 'Inputs', path: '/getting-started/inputs' },
		outputs: { segment: 'Outputs', path: '/getting-started/outputs' },
		'activation-functions': { segment: 'Activation Functions', path: '/activation-functions' },
		'what-is-an-activation-function': {
			segment: 'What is an Activation Function?',
			path: '/activation-functions/what-is-an-activation-function'
		},
		step: {
			segment: 'Step',
			path: '/activation-functions/step'
		},
		sigmoid: {
			segment: 'Sigmoid',
			path: '/activation-functions/sigmoid'
		},
		tanh: {
			segment: 'Tanh',
			path: '/activation-functions/tanh'
		},
		relu: {
			segment: 'ReLU',
			path: '/activation-functions/relu'
		},
		perceptrons: {
			segment: 'Perceptrons',
			path: '/perceptrons'
		},
		'what-is-a-perceptron': {
			segment: 'What is a Perceptron?',
			path: '/perceptrons/what-is-a-perceptron'
		},
		'single-layer-perceptron': {
			segment: 'Single-Layer Perceptron',
			path: '/perceptrons/single-layer-perceptron'
		},
		'multi-layer-perceptron': {
			segment: 'Multi-Layer Perceptron',
			path: '/perceptrons/multi-layer-perceptron'
		},
		'decision-functions': {
			segment: 'Decision Functions',
			path: '/decision-functions'
		},
		'step-decision-function': {
			segment: 'Step Decision Function',
			path: '/step-decision-function'
		},
		calculus: {
			segment: 'Calculus',
			path: '/calculus'
		},
		'derivative-of-activation-functions': {
			segment: 'Derivative of Activation Functions',
			path: '/calculus/derivative-of-activation-functions'
		},
		gradients: {
			segment: 'Gradients',
			path: '/calculus/gradients'
		},
		backpropagation: {
			segment: 'Backpropagation',
			path: '/calculus/backpropagation'
		}
	};
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{@const segments = page.url.pathname.split('/')}
		{#each segments as segment, index}
			{@const breadcrumb: BreadcrumbObject | undefined = lookup[segment]}
			{#if breadcrumb}
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href={breadcrumb.path}>{breadcrumb.segment}</Breadcrumb.Link>
				</Breadcrumb.Item>
				{#if index < segments.length - 1}
					<Breadcrumb.Separator class="hidden md:block" />
				{/if}
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
