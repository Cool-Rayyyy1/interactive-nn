<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		Position,
		type SnapGrid
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { nodeTypes } from '$lib/types';
	import { simpleId } from '$lib/utils';

	let nodes = $state.raw([
		{
			id: 'neuron-1',
			type: 'neuron',
			data: {
				handles: [
					{ type: 'target', position: Position.Bottom, id: simpleId() },
					{ type: 'target', position: Position.Left, id: simpleId() }
				]
			},
			position: { x: 0, y: 0 }
		},
		{
			id: 'input-1',
			type: 'nnInput',
			data: {
				handles: [{ type: 'source', position: Position.Top, id: simpleId() }]
			},
			position: { x: 0, y: 200 }
		},
		{
			id: 'bias-1',
			type: 'nnInput',
			data: {
				handles: [{ type: 'source', position: Position.Right, id: simpleId() }]
			},
			position: { x: -200, y: 0 }
		},
		{
			id: 'weight-1',
			type: 'weight',
			data: {
				handles: [
					{ type: 'target', position: Position.Bottom, id: simpleId() },
					{ type: 'source', position: Position.Top, id: simpleId() }
				]
			},
			position: { x: 0, y: 100 }
		},
		{
			id: 'weight-2',
			type: 'weight',
			data: {
				handles: [
					{ type: 'target', position: Position.Left, id: simpleId() },
					{ type: 'source', position: Position.Right, id: simpleId() }
				]
			},
			position: { x: -100, y: 0 }
		}
	]);

	let edges = $state.raw([
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
	]);

	const snapGrid: SnapGrid = [25, 25];
</script>

<!--
👇 By default, the Svelte Flow container has a height of 100%.
This means that the parent container needs a height to render the flow.
-->
<div>
	<h1>Single-Layer Perceptron</h1>
	<div style:height="500px" class="border-2">
		{console.log(nodes)}
		{console.log(edges)}
		<SvelteFlow
			bind:nodes
			bind:edges
			{snapGrid}
			{nodeTypes}
			fitView
			onnodeclick={(event) => console.log('on node click', event.node.data)}
		>
			<Controls />
			<Background variant={BackgroundVariant.Dots} />
		</SvelteFlow>
	</div>
</div>
