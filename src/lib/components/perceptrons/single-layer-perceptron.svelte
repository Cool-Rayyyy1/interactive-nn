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
						position: Position.Left,
						id: 'neuron-0-0-left'
					},
					{
						type: 'target',
						position: Position.Bottom,
						id: 'neuron-0-0-bottom'
					}
				]
			},
			position: { x: 0, y: 0 }
		},
		{
			id: 'input-0-0',
			type: 'nnInput',
			data: {
				display: 'B=1',
				handles: [
					{
						type: 'source',
						position: Position.Right
					}
				]
			},
			position: { x: -200, y: 0 }
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
			position: { x: 0, y: 200 }
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
						position: Position.Left
					},
					{
						type: 'source',
						position: Position.Right
					}
				]
			},
			position: { x: -100, y: 0 }
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
			position: { x: 0, y: 100 }
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
			id: 'weight-0-0-0_neuron-0-0',
			type: 'default',
			source: 'weight-0-0-0',
			target: 'neuron-0-0',
			targetHandle: 'neuron-0-0-left'
		},
		{
			id: 'input-0-1_weight-0-0-1',
			type: 'default',
			source: 'input-0-1',
			target: 'weight-0-0-1'
		},
		{
			id: 'weight-0-0-1_neuron-0-0',
			type: 'default',
			source: 'weight-0-0-1',
			target: 'neuron-0-0',
			targetHandle: 'neuron-0-0-bottom'
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
