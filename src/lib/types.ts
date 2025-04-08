<<<<<<< HEAD
export interface Data {
  x: number,
  y: number,
}
=======
import NnInputNode from '$lib/components/nodes/nn-input-node.svelte';
import NeuronNode from '$lib/components/nodes/neuron-node.svelte';
import WeightNode from '$lib/components/nodes/weight-node.svelte';
import type { NodeTypes, Node } from '@xyflow/svelte';

export const nodeTypes: NodeTypes = {
  nnInput: NnInputNode,
  neuron: NeuronNode,
  weight: WeightNode
};


export type InputNodeType = Node<{ input: number }, 'nnInput'>;
export type WeightNodeType = Node<{ input: number, weight: number }, 'weight'>;
export type NeuronNodeType = Node<{ input: number, weight: number }, 'neuron'>;

export type CustomNodes = InputNodeType | WeightNodeType | NeuronNodeType;

>>>>>>> 3d7092e24b27123a05678628be7a94c3df70035c
