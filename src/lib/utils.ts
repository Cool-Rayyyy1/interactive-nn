import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivationFunction, type BiasNode, type Input, type InputLayer, type InputNodeType, type Network, type Neuron, type ProductNode, type WeightNodeType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function simpleId(): string {
  return Math.round(Math.random() * 100 * Math.random() * 100 * Math.random() * 100).toString()
}

export function isInputNode(
  node: any,
): node is InputNodeType | WeightNodeType {
  return !node || !node.type
    ? false
    : node.type === 'nnInput' || node.type === 'weight';
}

export function range(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(+i.toFixed(2));
  }
  return result;
}

export function sigmoid(x: number): number {
  return (1 / (1 + Math.exp(-x)))
}

export function relu(x: number): number {
  return Math.max(0, x)
}

export function weightedBias(node: BiasNode): Input {
  return { input: node.input.input, output: node.weight * node.input.output }
}


export function weightedInput(node: ProductNode): Input[] {
  return node.inputs.map((val) => <Input>{ input: val.input, output: val.output * node.weight })
}

export function activate(neuron: Neuron, input: number): number {
  switch (neuron.activation) {
    case ActivationFunction.Step:
      return Math.sign(input)
    case ActivationFunction.Sigmoid:
      return sigmoid(input)
    case ActivationFunction.Tanh:
      return Math.tanh(input)
    case ActivationFunction.ReLU:
      return relu(input)
  }
}

export function layerValue(layer: InputLayer): Input[] {
  const bias = weightedBias(layer.bias);
  const inputDotProduct = mergeProductArrays(layer.values.map((val) => weightedInput(val)));
  return inputDotProduct.map((val): Input => <Input>{ input: val.input, output: activate(layer.neuron, bias.output + val.output) })
}

export function networkValue(network: Network): Input[] {
  return layerValue(network.input)
}

function mergeProductArrays(arrays: Input[][]): Input[] {
  const cols = range(0, arrays.length, 1);
  const merged: Input[] = []
  for (let i = 0; i < arrays[0].length; i++) {
    const total = cols.reduce((acc, _, idx) => acc + arrays[idx][i].output, 0);
    merged[i] = { input: arrays[0][i].input, output: total }
  }
  return merged;
}

export function genInputs(range: number[]): Input[] {
  return range.map((val) => <Input>{ input: val, output: val })
}

export function activateInputs(inputs: Input[], neuron: Neuron): Input[] {
  return inputs.map((val) => <Input>{ input: val.input, output: activate(neuron, val.output) })
}
