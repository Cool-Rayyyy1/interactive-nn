<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { page } from '$app/state';

	type LookupMap = {
		[key: string]: BreadcrumbObject;
	};

	type BreadcrumbObject = { segment: string; path: string };

	let lookup: LookupMap = {
		'': { segment: 'Welcome!', path: '/' },
		'getting-started': { segment: 'Getting Started', path: '/getting-started' },
		'what-is-a-neural-network': {
			segment: 'What is a Neural Network?',
			path: '/getting-started/what-is-a-neural-network'
		},
		neurons: { segment: 'Neurons', path: '/getting-started#neurons' },
		inputs: { segment: 'Inputs', path: '/getting-started#inputs' },
		outputs: { segment: 'Outputs', path: '/getting-started#outputs' },
		perceptrons: { segment: 'Perceptrons', path: '/getting-started#perceptrons' },
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
		'one-input-perceptrons': {
			segment: 'One Dimension Perceptrons',
			path: '/one-input-perceptrons'
		},
		'one-input-perceptron': {
			segment: 'One Layer',
			path: '/one-input-perceptrons/one-layer-perceptron'
		},
		'two-layer-perceptron': {
			segment: 'Two Layer',
			path: '/one-input-perceptrons/two-layer-perceptron'
		},
		'two-input-perceptrons': {
			segment: 'Two Dimension Perceptrons',
			path: '/two-input-perceptrons'
		},
		'one-layer-perceptron': {
			segment: 'One Layer',
			path: '/one-layer-perceptron'
		},
		'four-neuron-perceptron': {
			segment: 'Two Layer with Four Neurons',
			path: '/four-neuron-perceptron'
		},
		calculus: {
			segment: 'Calculus',
			path: '/calculus'
		},
		motivation: {
			segment: 'Motivation',
			path: '/calculus/motivation'
		},
		derivatives: {
			segment: 'Derivatives',
			path: '/calculus/derivative'
		},
		'derivatives-of-activation-functions': {
			segment: 'Derivatives of Activation Functions',
			path: '/calculus/derivatives-of-activation-functions'
		},
		'gradient-descent': {
			segment: 'Gradient Descent',
			path: '/calculus/gradient-descent'
		},
		backpropagation: {
			segment: 'Backpropagation',
			path: '/calculus/backpropagation'
		},
		about: {
			segment: 'About',
			path: '/about'
		}
	};
</script>

<!--
@component
Dynamically generates breadcrumbs from the page URL.

Uses a lookup dict so that each URL segment is transformed
into a human-friendly format.
-->
<Breadcrumb.Root>
	<Breadcrumb.List>
		{#if page.url.pathname === '/'}
			<Breadcrumb.Item class="hidden md:block">
				<Breadcrumb.Link href={'/'}>Welcome!</Breadcrumb.Link>
			</Breadcrumb.Item>
		{:else}
			{@const segments = page.url.pathname
				.split(/[/\#]/)
				.concat([page.url.hash.replace('#', '')])
				.filter((word) => word != '')}
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
		{/if}
	</Breadcrumb.List>
</Breadcrumb.Root>
