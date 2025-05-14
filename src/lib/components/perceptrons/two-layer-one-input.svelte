<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		type SnapGrid,
		type Edge,
		type Node,
		Position
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { nodeTypes, type Network } from '$lib/types';
	import { getNetworkContext } from '$lib/context';

	let network: Network = getNetworkContext();

	const initialNodes: Node[] = [
		{
			id: 'neuron-0-0',
			type: 'neuron',
			data: {
				neuron: network.layers[0].neurons[0],
				handles: [
					{
						type: 'target',
						position: Position.Bottom,
						id: 'neuron-1-bottom'
					},
					{
						type: 'source',
						position: Position.Top,
						id: 'neuron-0-0-top'
					}
				]
			},
			position: { x: -100, y: 0 }
		},
		{
			id: 'neuron-0-1',
			type: 'neuron',
			data: {
				neuron: network.layers[0].neurons[1],
				handles: [
					{
						type: 'target',
						position: Position.Bottom,
						id: 'neuron-1-bottom'
					},
					{
						type: 'source',
						position: Position.Top,
						id: 'neuron-0-1-top'
					}
				]
			},
			position: { x: 100, y: 0 }
		},
		{
			id: 'neuron-1-0',
			type: 'neuron',
			data: {
				neuron: network.layers[1].neurons[0],
				handles: [
					{
						type: 'target',
						position: Position.Bottom,
						id: 'neuron-1-bottom'
					}
				]
			},
			position: { x: 0, y: -200 }
		},
		{
			id: 'input-0-0',
			type: 'nnInput',
			data: {
				display: 'B=1',
				handles: [
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: -200, y: 200 }
		},
		{
			id: 'input-0-1',
			type: 'nnInput',
			data: {
				display: 'X1',
				handles: [
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 200, y: 200 }
		},
		{
			id: 'input-1-0',
			type: 'nnInput',
			data: {
				display: 'B=1',
				handles: [
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 0, y: 0 }
		},
		{
			id: 'weight-0-0-0',
			type: 'weight',
			data: {
				layer: 0,
				neuron: 0,
				index: 0,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: -200, y: 100 }
		},
		{
			id: 'weight-0-0-1',
			type: 'weight',
			data: {
				layer: 0,
				neuron: 0,
				index: 1,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: -100, y: 100 }
		},
		{
			id: 'weight-0-1-0',
			type: 'weight',
			data: {
				layer: 0,
				neuron: 1,
				index: 0,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 100, y: 100 }
		},
		{
			id: 'weight-0-1-1',
			type: 'weight',
			data: {
				layer: 0,
				neuron: 1,
				index: 1,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 200, y: 100 }
		},
		{
			id: 'weight-1-0-0',
			type: 'weight',
			data: {
				layer: 1,
				neuron: 0,
				index: 0,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 0, y: -100 }
		},
		{
			id: 'weight-1-0-1',
			type: 'weight',
			data: {
				layer: 1,
				neuron: 0,
				index: 1,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: -100, y: -100 }
		},
		{
			id: 'weight-1-0-2',
			type: 'weight',
			data: {
				layer: 1,
				neuron: 0,
				index: 2,
				handles: [
					{
						type: 'target',
						position: Position.Bottom
					},
					{
						type: 'source',
						position: Position.Top
					}
				]
			},
			position: { x: 100, y: -100 }
		}
	];

	let initialEdges: Edge[] = [
		{
			id: 'input-0-0_weight-0-0-0',
			type: 'default',
			source: 'input-0-0',
			target: 'weight-0-0-0'
		},
		{
			id: 'input-0-0_weight-0-1-0',
			type: 'default',
			source: 'input-0-0',
			target: 'weight-0-1-0'
		},
		{
			id: 'input-0-1_weight-0-0-1',
			type: 'default',
			source: 'input-0-1',
			target: 'weight-0-0-1'
		},
		{
			id: 'input-0-1_weight-0-1-1',
			type: 'default',
			source: 'input-0-1',
			target: 'weight-0-1-1'
		},
		{
			id: 'weight-0-0-0_neuron-0-0',
			type: 'default',
			source: 'weight-0-0-0',
			target: 'neuron-0-0',
			targetHandle: 'neuron-1-bottom'
		},
		{
			id: 'weight-0-0-1_neuron-0-0',
			type: 'default',
			source: 'weight-0-0-1',
			target: 'neuron-0-0',
			targetHandle: 'neuron-1-bottom'
		},
		{
			id: 'weight-0-1-0_neuron-0-1',
			type: 'default',
			source: 'weight-0-1-0',
			target: 'neuron-0-1',
			targetHandle: 'neuron-1-bottom'
		},
		{
			id: 'weight-0-1-1_neuron-0-1',
			type: 'default',
			source: 'weight-0-1-1',
			target: 'neuron-0-1',
			targetHandle: 'neuron-1-bottom'
		},
		// Layer 1
		{
			id: 'input-1-0_weight-1-0-0',
			type: 'default',
			source: 'input-1-0',
			target: 'weight-1-0-0'
		},
		{
			id: 'neuron-0-0_weight-1-0-1',
			type: 'default',
			source: 'neuron-0-0',
			target: 'weight-1-0-1'
		},
		{
			id: 'neuron-0-1_weight-1-0-2',
			type: 'default',
			source: 'neuron-0-1',
			target: 'weight-1-0-2'
		},
		{
			id: 'weight-1-0-0_neuron-1-0',
			type: 'default',
			source: 'weight-1-0-0',
			target: 'neuron-1-0'
		},
		{
			id: 'weight-1-1-0_neuron-1-0',
			type: 'default',
			source: 'weight-1-0-1',
			target: 'neuron-1-0'
		},
		{
			id: 'weight-1-2-0_neuron-1-0',
			type: 'default',
			source: 'weight-1-0-2',
			target: 'neuron-1-0'
		}
	];

	let nodes = $state.raw<Node[]>(initialNodes);
	let edges = $state.raw<Edge[]>(initialEdges);

	const snapGrid: SnapGrid = [25, 25];
</script>

<div style:height="500px" class="border-2">
	<SvelteFlow bind:nodes bind:edges {snapGrid} {nodeTypes} fitView>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
	</SvelteFlow>
</div>
