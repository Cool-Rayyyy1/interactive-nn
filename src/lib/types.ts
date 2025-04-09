import NnInputNode from '$lib/components/nodes/nn-input-node.svelte';
import NeuronNode from '$lib/components/nodes/neuron-node.svelte';
import WeightNode from '$lib/components/nodes/weight-node.svelte';
import type { NodeTypes, Node, Position } from '@xyflow/svelte';
import type { PerspectiveCamera, OrthographicCamera } from 'three'

export type Camera = OrthographicCamera | PerspectiveCamera

export const nodeTypes: NodeTypes = {
  nnInput: NnInputNode,
  neuron: NeuronNode,
  weight: WeightNode
};

export type InputNodeType = Node<{ input: number, handles: HandleProp[] }, 'nnInput'>;
export type WeightNodeType = Node<{ input: number, weight: number, handles: HandleProp[] }, 'weight'>;
export type NeuronNodeType = Node<{ input: number, weight: number, handles: HandleProp[] }, 'neuron'>;

export type CustomNodes = InputNodeType | WeightNodeType | NeuronNodeType;

export interface Data {
  x: number,
  y: number,
}

export interface HandleProp {
  type: "source" | "target",
  position: Position,
  id?: string,
}

export interface Config {
  coords: { x: number; y: number; z: number };
  shape: [number, number, number];
  color: string;
};
