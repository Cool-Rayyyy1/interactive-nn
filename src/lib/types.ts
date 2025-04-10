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

export type InputNodeType = Node<{ display: string, handles: HandleProp[] }, 'nnInput'>;
export type WeightNodeType = Node<{ productNode: ProductNode, handles: HandleProp[] }, 'weight'>;
export type NeuronNodeType = Node<{ layer: InputLayer | HiddenLayer, handles: HandleProp[] }, 'neuron'>;

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
}

export interface Network {
  input: InputLayer,
  hidden?: HiddenLayer[],
}

export interface InputLayer {
  bias: BiasNode;
  values: ProductNode[];
  neuron: Neuron;
}

export interface HiddenLayer {
  bias: BiasNode;
  weights: number[]
  neuron: Neuron;
}

export interface ProductNode {
  weight: number;
  inputs: Input[];
}

export interface BiasNode {
  weight: number;
  input: Input;
}

export interface Neuron {
  activation: ActivationFunction
}

export interface Input {
  readonly input: number;
  output: number;
}

export enum ActivationFunction {
  Step,
  Sigmoid,
  Tanh,
  ReLU,
}

