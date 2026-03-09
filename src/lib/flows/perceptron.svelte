<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant, MarkerType } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import type { Edge } from '@xyflow/svelte';

	import SimplePerceptronInput from './simple-perceptron-input.svelte';
	import SimplePerceptronNeuron from './simple-perceptron-neuron.svelte';
	import SimplePerceptronOutput from './simple-perceptron-output.svelte';

	const nodeTypes = {
		simplePerceptronInput: SimplePerceptronInput,
		simplePerceptronNeuron: SimplePerceptronNeuron,
		simplePerceptronOutput: SimplePerceptronOutput
	};

	let nodes = $state.raw([
		{
			id: '1',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 0 },
			data: { index: 0 }
		},
		{
			id: '2',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 50 },
			data: { index: 1 }
		},
		{
			id: '3',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 100 },
			data: { index: 2 }
		},
		{
			id: '4',
			type: 'simplePerceptronNeuron',
			position: { x: 100, y: 38 },
			data: { size: 15 }
		},
		{
			id: '5',
			type: 'simplePerceptronOutput',
			position: { x: 200, y: 50 },
			data: { output: 'Output' }
		}
	]);

	let edges: Edge[] = $state.raw([
		{
			id: '1-4',
			source: '1',
			target: '4',
			targetHandle: '1',
			type: 'straight',
			label: 'W0'
		},
		{
			id: '2-4',
			source: '2',
			target: '4',
			targetHandle: '1',
			type: 'straight',
			label: 'W1'
		},
		{
			id: '3-4',
			source: '3',
			target: '4',
			targetHandle: '1',
			type: 'straight',
			label: 'W2'
		},
		{
			id: '4-5',
			source: '4',
			target: '5',
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
