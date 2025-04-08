<script lang="ts">
	import { writable } from 'svelte/store';
	import { SvelteFlow, Controls, Background, BackgroundVariant } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import InputNode from '$lib/components/nodes/input-node.svelte';
	import NeuronNode from '$lib/components/nodes/neuron-node.svelte';
	import type { SnapGrid } from '@xyflow/system';

	const nodeTypes = {
		input: InputNode,
		neuron: NeuronNode
	};

	const nodes = writable([
		{
			id: 'neuron-1',
			type: 'neuron',
			data: { label: 'Node' },
			position: { x: 0, y: 0 }
		},
		{
			id: 'input-1',
			type: 'input',
			data: { label: 'Input Node' },
			position: { x: -100, y: 150 }
		},
		{
			id: 'input-2',
			type: 'input',
			data: { label: 'Input Node' },
			position: { x: 100, y: 150 }
		}
	]);

	// same for edges
	const edges = writable([
		{
			id: 'input-1_neuron-1',
			type: 'default',
			source: 'input-1',
			target: 'neuron-1',
			label: 'Edge Text'
		},
		{
			id: 'input-2_neuron-1',
			type: 'default',
			source: 'input-2',
			target: 'neuron-1',
			label: 'Edge Text'
		}
	]);

	const snapGrid: SnapGrid = [25, 25];
</script>

<!--
👇 By default, the Svelte Flow container has a height of 100%.
This means that the parent container needs a height to render the flow.
-->
<div style:height="500px" class="border-2">
	<SvelteFlow
		{nodes}
		{edges}
		{snapGrid}
		{nodeTypes}
		fitView
		on:nodeclick={(event) => console.log('on node click', event.detail.node)}
	>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
	</SvelteFlow>
</div>
