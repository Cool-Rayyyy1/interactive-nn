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

export interface NeuronValues {
  val: number;
  raw: number;
  error: number;
}

export interface GradientState {
  weights: Record<string, number>;
  biases: Record<string, number>;
}

export type TrainingStep = 'idle' | 'forward' | 'backward' | 'update';

export type ActivationType = 'sigmoid' | 'tanh' | 'relu';


export interface HistoryItem {
  epoch: number;
  loss: number;
}

export interface NetworkState {
  weights: Record<string, number>;
  biases: Record<string, number>;
  neuronValues: Record<string, NeuronValues>;
  gradients: GradientState;
  step: TrainingStep;
  subStep: number;
  activeElement: string | null;
  mathDetails: string | null;
  symbolicMath: string | null;
  numericMath: string | null;
  epoch: number;
}

export type Act = "sign" | "step" | "tanh" | "sigmoid" | "relu";

export interface ONeuron {
  w1: number;
  w2: number;
  act: Act;
}

export interface Layer2Neuron {
  v1: number;
  v2: number;
  v3: number;
  act: Act;
}

export interface TrainingPoint {
  id: string;
  x: number; // in range [-5, 5]
  y: number; // in range [-5, 5]
  label: 1 | -1; // 1 = Blue/Class A, -1 = Red/Class B
}

export interface ONetworkState {
  neuronCount: number;
  neurons: ONeuron[];
  bias: number;
  outputActivation: Act;
  points: TrainingPoint[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const ACTIVATION_FUNCTIONS: {
  value: Act;
  name: string;
  formula: string;
  description: string;
  range: string;
}[] = [
  {
    value: "sign",
    name: "Sign (Signum)",
    formula: "f(x) = x < 0 ? -1 : 1",
    description: "Outputs -1 or 1. Creates sharp binary classifiers.",
    range: "[-1, 1]",
  },
  {
    value: "step",
    name: "Step (Heaviside)",
    formula: "f(x) = x >= 0 ? 1 : 0",
    description: "Outputs 0 or 1. Classical perceptron activation.",
    range: "[0, 1]",
  },
  {
    value: "tanh",
    name: "Hyperbolic Tangent (tanh)",
    formula: "f(x) = tanh(x)",
    description: "Smooth S-curve centered at 0. [-1, 1] output range.",
    range: "[-1, 1]",
  },
  {
    value: "sigmoid",
    name: "Sigmoid (Logistic)",
    formula: "f(x) = 1 / (1 + e^-x)",
    description: "Smooth probability squashing function between 0 and 1.",
    range: "[0, 1]",
  },
  {
    value: "relu",
    name: "Rectified Linear (ReLU)",
    formula: "f(x) = max(0, x)",
    description: "Passes positive inputs; outputs 0 for negatives. Promotes sparsity.",
    range: "[0, inf)",
  },
];
