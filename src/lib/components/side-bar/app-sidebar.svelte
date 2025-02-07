<script lang="ts" module>
	// sample data
	const data = {
		navMain: [
			{
				title: 'Getting Started',
				url: '/getting-started',
				items: [
					{
						title: 'What is a Neural Network?',
						url: '/getting-started/what-is-a-neural-network'
					},
					{
						title: 'Neurons',
						url: '/getting-started/neurons'
					},
					{
						title: 'Inputs',
						url: '/getting-started/inputs'
					},
					{
						title: 'Outputs',
						url: '/getting-started/outputs'
					}
				]
			},
			{
				title: 'Activation Functions',
				url: '/activation-functions',
				items: [
					{
						title: 'What is an Activation Function?',
						url: '/activation-functions/what-is-an-activation-function'
					},
					{
						title: 'Step',
						url: '/activation-functions/step'
					},
					{
						title: 'Sigmoid',
						url: '/activation-functions/sigmoid'
					},
					{
						title: 'Tanh',
						url: '/activation-functions/tanh'
					},
					{
						title: 'ReLU',
						url: '/activation-functions/relu'
					}
				]
			},
			{
				title: 'Perceptrons',
				url: '/perceptrons',
				items: [
					{
						title: 'What is a Perceptron?',
						url: '/perceptrons/what-is-a-perceptron'
					},
					{
						title: 'Single-Layer Perceptron',
						url: '/perceptrons/single-layer-perceptron'
					},
					{
						title: 'Multi-Layer Perceptron',
						url: '/perceptrons/multi-layer-perceptron'
					}
				]
			},
			{
				title: 'Calculus',
				url: '/calculus',
				items: [
					{
						title: 'Derivative of Activation Functions',
						url: '/calculus/derivative-of-activation-functions'
					},
					{
						title: 'Gradients',
						url: '/calculus/gradients'
					},
					{
						title: 'Backpropagation',
						url: '/calculus/backpropagation'
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<div class="flex place-content-center">
			<h1 class="font-bold text-blue-400">Interactive NN</h1>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
