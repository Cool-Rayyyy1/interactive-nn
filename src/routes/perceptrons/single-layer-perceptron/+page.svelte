<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		type SnapGrid,
		type Edge,
		type Node
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { nodeTypes } from '$lib/types';

	const initialNodes: Node[] = [
		{
			id: 'neuron-1',
			type: 'neuron',
			data: {},
			position: { x: 0, y: 0 }
		},
		{
			id: 'input-1',
			type: 'nnInput',
			data: {},
			position: { x: 100, y: 200 }
		},
		{
			id: 'bias-1',
			type: 'nnInput',
			data: {},
			position: { x: -100, y: 200 }
		},
		{
			id: 'weight-1',
			type: 'weight',
			data: {},
			position: { x: 100, y: 100 }
		},
		{
			id: 'weight-2',
			type: 'weight',
			data: {},
			position: { x: -100, y: 100 }
		}
	];

	let initialEdges: Edge[] = [
		{
			id: 'input-1_weight-1',
			type: 'default',
			source: 'input-1',
			target: 'weight-1'
		},
		{
			id: 'weight-1_neuron-1',
			type: 'default',
			source: 'weight-1',
			target: 'neuron-1'
		},
		{
			id: 'bias-1_weight-2',
			type: 'default',
			source: 'bias-1',
			target: 'weight-2'
		},
		{
			id: 'weight-2_neuron-1',
			type: 'default',
			source: 'weight-2',
			target: 'neuron-1'
		}
	];

	let nodes = $state.raw<Node[]>(initialNodes);
	let edges = $state.raw<Edge[]>(initialEdges);

	const snapGrid: SnapGrid = [25, 25];
</script>

<div>
	<h1>Single-Layer Perceptron</h1>
	<div style:height="500px" class="border-2">
		<SvelteFlow bind:nodes bind:edges {snapGrid} {nodeTypes} fitView>
			<Controls />
			<Background variant={BackgroundVariant.Dots} />
		</SvelteFlow>
	</div>
</div>
