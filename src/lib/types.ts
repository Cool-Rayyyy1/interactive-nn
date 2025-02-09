import NnInputNode from '$lib/components/nodes/nn-input-node.svelte';
import NeuronNode from '$lib/components/nodes/neuron-node.svelte';
import WeightNode from '$lib/components/nodes/weight-node.svelte';
import type { NodeProps, NodeTypes, Position } from '@xyflow/svelte';

export type HandleType = {
  type: 'source' | 'target', position: Position, id: string
}

export const nodeTypes: NodeTypes = {
  nnInput: NnInputNode,
  neuron: NeuronNode,
  weight: WeightNode
};

export type CustomNodeProps = {
  handles: HandleType[]
} & NodeProps

