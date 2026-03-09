<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant, MarkerType } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import type { Edge } from '@xyflow/svelte';

	import SimplePerceptronNeuron from './simple-perceptron-neuron.svelte';
	import SimplePerceptronOutput from './simple-perceptron-output.svelte';
	import SimplePerceptronLabel from './simple-perceptron-label.svelte';

	const nodeTypes = {
		simplePerceptronLabel: SimplePerceptronLabel,
		simplePerceptronNeuron: SimplePerceptronNeuron,
		simplePerceptronOutput: SimplePerceptronOutput
	};

	let nodes = $state.raw([
		{
			id: '1',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 0 },
			data: { index: 0, day: 'Mon', value: 1 }
		},
		{
			id: '2',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 50 },
			data: { index: 1, day: 'Tue', value: 1 }
		},
		{
			id: '3',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 100 },
			data: { index: 2, day: 'Wed', value: 1 }
		},
		{
			id: '4',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 150 },
			data: { index: 3, day: 'Thu', value: 0 }
		},
		{
			id: '5',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 200 },
			data: { index: 4, day: 'Fri', value: 0 }
		},
		{
			id: '6',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 250 },
			data: { index: 5, day: 'Sat', value: 0 }
		},
		{
			id: '7',
			type: 'simplePerceptronLabel',
			position: { x: 0, y: 300 },
			data: { index: 6, day: 'Sun', value: 0 }
		},
		{
			id: '8',
			type: 'simplePerceptronNeuron',
			position: { x: 300, y: 120 },
			data: { content: '0.6 < 1', size: 50 }
		},
		{
			id: '9',
			type: 'simplePerceptronOutput',
			position: { x: 435, y: 153 },
			data: { output: 'No Rain!' }
		}
	]);

	let edges: Edge[] = $state.raw([
		{
			id: '1-8',
			source: '1',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.1'
		},
		{
			id: '2-8',
			source: '2',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.2'
		},
		{
			id: '3-8',
			source: '3',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.3'
		},
		{
			id: '4-8',
			source: '4',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.4'
		},
		{
			id: '5-8',
			source: '5',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.5'
		},
		{
			id: '6-8',
			source: '6',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.6'
		},
		{
			id: '7-8',
			source: '7',
			target: '8',
			targetHandle: '1',
			type: 'straight',
			label: '0.7'
		},
		{
			id: '8-9',
			source: '8',
			target: '9',
			type: 'straight',
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		}
	]);
</script>

<div style:width="max-w" style:height="500px" class="border-2 border-blue-400">
	<SvelteFlow
		bind:nodes
		bind:edges
		{nodeTypes}
		fitView
		nodesDraggable={false}
		nodesConnectable={false}
		inert
	>
		<Background variant={BackgroundVariant.Cross} />
	</SvelteFlow>
</div>
