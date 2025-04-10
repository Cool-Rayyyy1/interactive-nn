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

/**
 * 2d (x, y) coordinates in a cartesian plane
 */
export interface Coords2d {
  x: number,
  y: number,
}

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
export interface Network {
  input: InputLayer,
  hidden?: HiddenLayer[],
}

/**
 * A Neuron in a Neural Network with an associated Activation Function
 */
export interface Neuron {
  activation: ActivationFunction
}

/**
 * An Input Layer to a Neural Network
 */
export interface InputLayer {
  bias: BiasNode;
  values: ProductNode[];
  neuron: Neuron;
}

/**
 * A Hidden Layer in a Neural Network
 */
export interface HiddenLayer {
  bias: BiasNode;
  weights: number[]
  neuron: Neuron;
}

/**
 * An Input Node to a Neural Network. This is distinguished from a normal
 * input to a Neural Network as it has one associated weight, but a range 
 * of associated inputs. This is because for the visual representation goal
 * of this project, we generate outputs for a provided range. The users only 
 * interact with weights.
 */
export interface ProductNode {
  weight: number;
  inputs: Input[];
}

/**
 * A Bias Node in a Neural Network with a weight value, and an Input.
 */
export interface BiasNode {
  weight: number;
  input: Input;
}

/**
 * An input to a Neural Network. This is effectively a tuple to keep track of
 * the original input value can be tracked as the ouput is transformed as 
 * it is passed through the Neural Network.
 */
export interface Input {
  readonly input: number;
  output: number;
}

/**
 * Tracks the various Activation Functions available in a network. Helpful for 
 * matching which Activation Function should be applied by a given Neuron
 * in the Network.
 */
export enum ActivationFunction {
  Step,
  Sigmoid,
  Tanh,
  ReLU,
}

