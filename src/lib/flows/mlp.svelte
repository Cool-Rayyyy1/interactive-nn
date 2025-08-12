<script lang="ts">
	import { SvelteFlow, Background, BackgroundVariant, MarkerType } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import type { Edge } from '@xyflow/svelte';

	import SimplePerceptronInput from './simple-perceptron-input.svelte';
	import SimplePerceptronNeuron from './simple-perceptron-neuron-small.svelte';
	import SimplePerceptronOutput from './simple-perceptron-output.svelte';

	const nodeTypes = {
		simplePerceptronInput: SimplePerceptronInput,
		simplePerceptronNeuron: SimplePerceptronNeuron,
		simplePerceptronOutput: SimplePerceptronOutput
	};

	let nodes = $state.raw([
		{
			id: 'x0',
			type: 'simplePerceptronInput',
			position: { x: 0, y: -15 },
			data: { index: 0 }
		},
		{
			id: 'x1',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 35 },
			data: { index: 1 }
		},
		{
			id: 'x2',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 85 },
			data: { index: 2 }
		},
		{
			id: 'x3',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 135 },
			data: { index: 3 }
		},
		{
			id: 'x4',
			type: 'simplePerceptronInput',
			position: { x: 0, y: 185 },
			data: { index: 4 }
		},
		{
			id: 'n11',
			type: 'simplePerceptronNeuron',
			position: { x: 75, y: 15 },
			data: { size: 15 }
		},
		{
			id: 'n12',
			type: 'simplePerceptronNeuron',
			position: { x: 75, y: 85 },
			data: { size: 15 }
		},
		{
			id: 'n13',
			type: 'simplePerceptronNeuron',
			position: { x: 75, y: 155 },
			data: { size: 15 }
		},
		{
			id: 'n21',
			type: 'simplePerceptronNeuron',
			position: { x: 175, y: 15 },
			data: { size: 15 }
		},
		{
			id: 'n22',
			type: 'simplePerceptronNeuron',
			position: { x: 175, y: 85 },
			data: { size: 15 }
		},
		{
			id: 'n23',
			type: 'simplePerceptronNeuron',
			position: { x: 175, y: 155 },
			data: { size: 15 }
		},
		{
			id: 'output',
			type: 'simplePerceptronOutput',
			position: { x: 275, y: 87 },
			data: { output: 'Output' }
		}
	]);

	let edges: Edge[] = $state.raw([
		{
			id: 'x0-n11',
			source: 'x0',
			target: 'n11',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x0-n12',
			source: 'x0',
			target: 'n12',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x0-n13',
			source: 'x0',
			target: 'n13',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x1-n11',
			source: 'x1',
			target: 'n11',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x1-n12',
			source: 'x1',
			target: 'n12',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x1-n13',
			source: 'x1',
			target: 'n13',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x2-n11',
			source: 'x2',
			target: 'n11',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x2-n12',
			source: 'x2',
			target: 'n12',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x2-n13',
			source: 'x2',
			target: 'n13',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x3-n11',
			source: 'x3',
			target: 'n11',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x3-n12',
			source: 'x3',
			target: 'n12',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x3-n13',
			source: 'x3',
			target: 'n13',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x4-n11',
			source: 'x4',
			target: 'n11',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x4-n12',
			source: 'x4',
			target: 'n12',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'x4-n13',
			source: 'x4',
			target: 'n13',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n11-n2',
			source: 'n11',
			target: 'n21',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n11-n22',
			source: 'n11',
			target: 'n22',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n11-n23',
			source: 'n11',
			target: 'n23',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n12-n2',
			source: 'n12',
			target: 'n21',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n12-n22',
			source: 'n12',
			target: 'n22',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n12-n23',
			source: 'n12',
			target: 'n23',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n13-n2',
			source: 'n13',
			target: 'n21',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n13-n22',
			source: 'n13',
			target: 'n22',
			targetHandle: '1',
			type: 'straight'
		},
		{
			id: 'n13-n23',
			source: 'n13',
			target: 'n23',
			targetHandle: '1',
			type: 'straight'
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
			id: 'n21-output',
			source: 'n21',
			target: 'output',
			type: 'straight'
		},
		{
			id: 'n22-output',
			source: 'n22',
			target: 'output',
			type: 'straight',
			markerEnd: {
				type: MarkerType.ArrowClosed
			}
		},
		{
			id: 'n23-output',
			source: 'n23',
			target: 'output',
			type: 'straight'
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
