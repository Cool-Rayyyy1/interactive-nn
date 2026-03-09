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
export type WeightNodeType = Node<{ layer: number, neuron: number, index: number, handles: HandleProp[] }, 'weight'>;
export type NeuronNodeType = Node<{ neuron: Neuron, handles: HandleProp[] }, 'neuron'>;

export type CustomNodes = InputNodeType | WeightNodeType | NeuronNodeType;

/**
 * Props for a <Handle /> component in xyflow
 */
export interface HandleProp {
  type: "source" | "target",
  position: Position,
  id?: string,
}

/**
 * Configuration values for a custom 3d element in Threlte
 */
export interface Config {
  coords: { x: number; y: number; z: number };
  shape: [number, number, number];
  color: string;
}

/**
 * Parent type for a Neural Network visual representation
 */
export class Network {
  inputs: Input[] = [];
  layers: Layer[] = [];
}

/**
 * A Layer in a Neural Network
 */
export interface Layer {
  inputs: Input[];
  weights: Weight[][];
  neurons: Neuron[];
}

/**
 * A Neuron in a Neural Network with an associated Activation Function
 */
export interface Neuron {
  activation: ActivationFunction
}

/**
 * A Weight value in the network. It has to be an object so that it can
 * be updated dynamically with xyflow.
 */
export interface Input {
  value: number[];
}

/**
 * A Weight value in the network. It has to be an object so that it can
 * be updated dynamically with xyflow.
 */
export interface Weight {
  value: number;
}

/**
 * The x, y input to a chart from the network.
 */
export interface Input2d {
  input: number;
  output: number;
}

/**
 * The x, y, z input to a chart from the network.
 */
export interface Input3d {
  input_x1: number;
  input_x2: number;
  output: number;
}

/**
 * Tracks the various Activation Functions available in a network. Helpful for 
 * matching which Activation Function should be applied by a given Neuron
 * in the Network.
 *
 * Variants:
 *  - Step
 *  - Sigmoid
 *  - Tanh
 *  - ReLU
 */
export enum ActivationFunction {
  Step = "Step",
  Sigmoid = "Sigmoid",
  Tanh = "Tanh",
  ReLU = "ReLU",
}

export interface SeriesData {
  input: number;
  activation: number;
  derivative: number;
}


export interface BarChartData {
  layer: number,
  value: number,
  area: number,
  cumulativeArea: number,
}
