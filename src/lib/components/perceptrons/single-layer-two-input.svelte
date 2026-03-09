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
			id: 'neuron-1',
			type: 'neuron',
			data: {
				neuron: network.layers[0].neurons[0],
				handles: [
					{
						type: 'target',
						position: Position.Bottom,
						id: 'neuron-1-bottom'
					}
				]
			},
			position: { x: 0, y: 0 }
		},
		{
			id: 'bias-1',
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
			id: 'input-1',
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
			position: { x: 0, y: 200 }
		},
		{
			id: 'input-2',
			type: 'nnInput',
			data: {
				display: 'X2',
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
			id: 'weight-1',
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
			id: 'weight-2',
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
			position: { x: 0, y: 100 }
		},
		{
			id: 'weight-3',
			type: 'weight',
			data: {
				layer: 0,
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
			position: { x: 200, y: 100 }
		}
	];

	let initialEdges: Edge[] = [
		{
			id: 'bias-1_weight-1',
			type: 'default',
			source: 'bias-1',
			target: 'weight-1'
		},
		{
			id: 'weight-1_neuron-1',
			type: 'default',
			source: 'weight-1',
			target: 'neuron-1',
			targetHandle: 'neuron-1-bottom'
		},
		{
			id: 'input-1_weight-2',
			type: 'default',
			source: 'input-1',
			target: 'weight-2'
		},
		{
			id: 'weight-2_neuron-1',
			type: 'default',
			source: 'weight-2',
			target: 'neuron-1',
			targetHandle: 'neuron-1-bottom'
		},
		{
			id: 'input-2_weight-3',
			type: 'default',
			source: 'input-2',
			target: 'weight-3'
		},
		{
			id: 'weight-3_neuron-1',
			type: 'default',
			source: 'weight-3',
			target: 'neuron-1',
			targetHandle: 'neuron-1-bottom'
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
