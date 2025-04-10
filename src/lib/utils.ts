import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivationFunction, type BiasNode, type Input, type InputLayer, type Network, type Neuron, type ProductNode } from "./types";

/**
 * Tailwind utility function. Provided by shadcn-svelte
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a range of numbers as a number[].
 *
 * @remarks
 * This is similar to Python's 'range()' but less flexible.
 *
 * @param start - The start of the range, inclusive
 * @param end - The end of the range, non-inclusive
 * @param step - The step between each value in the range
 * @returns The calculated range as a number[]
 */
export function range(start: number, end: number, step: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(+i.toFixed(2));
  }
  return result;
}

/**
 * Calculates the sigmoid value of a given input
 *
 * @remarks 
 * Sigmoid is calculated by:
 * (1 / (1 + Math.exp(-x)))
 *
 * @param x - The input value
 * @returns The sigmoid value of the input
 */
export function sigmoid(x: number): number {
  return (1 / (1 + Math.exp(-x)))
}

/**
 * Calculates the relu value of a given input
 *
 * @remarks
 * This is a standard rectified linear unit ("ReLU")
 * Math.max(0, x)
 *
 * @param x - The input value
 * @returns The sigmoid value of the input
 */
export function relu(x: number): number {
  return Math.max(0, x)
}

/**
 * Calculates the weighted value of a BiasNode in the network
 *
 * @param node - The BiasNode input
 * @returns the weight value of the BiasNode
 */
export function weightedBias(node: BiasNode): Input {
  return { input: node.input.input, output: node.weight * node.input.output }
}

/**
 * Calculates the weighted input range to the network for a given
 * ProductNode. It returns a range of Inputs, which contain the original input
 * and its transformed value at the given location in the network, due to the
 * interactive structure of this application
 *
 * @param node - The ProductNode Input
 * @returns The ranged of weighted inputs
 */
export function weightedInput(node: ProductNode): Input[] {
  return node.inputs.map((val) => <Input>{ input: val.input, output: val.output * node.weight })
}

/**
 * Runs an input value through the given Neuron's activation function
 * 
 * @param neuron - The neuron with the required activation function
 * @param input - The input value to transform with the activation
 * @returns The activated valued of the input
 */
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

/**
 * Computes the activated, weighted output range for the given network layer.
 *
 * @param layer - The network layer to compute the value of
 * @returns The activated, weighted output range for the layer
 */
export function layerValue(layer: InputLayer): Input[] {
  const bias = weightedBias(layer.bias);
  const inputDotProduct = mergeProductArrays(layer.values.map((val) => weightedInput(val)));
  return inputDotProduct.map((val): Input => <Input>{ input: val.input, output: activate(layer.neuron, bias.output + val.output) })
}

/**
 * Computes the activated, weighted output range for the given network.
 *
 * @param network - The network to compute the value of
 * @returns The activated, weighted output range for the network
 */
export function networkValue(network: Network): Input[] {
  return layerValue(network.input)
}

/**
 * Helper function to combine the values of adjacted Input[]
 *
 * @remarks
 * This is similar to a zip function. Arrays of Input[][]
 * must be same length.
 *
 * @param arrays - The Input[][] arrays to combine element-wise
 * @returns The element-wise combined Input[]
 */
function mergeProductArrays(arrays: Input[][]): Input[] {
  const cols = range(0, arrays.length, 1);
  const merged: Input[] = []
  for (let i = 0; i < arrays[0].length; i++) {
    const total = cols.reduce((acc, _, idx) => acc + arrays[idx][i].output, 0);
    merged[i] = { input: arrays[0][i].input, output: total }
  }
  return merged;
}

/**
 * Helper to generate a range of Input
 *
 * @param range - number[] range to generate Input[] from
 * @returns The generated Input[] range
 */
export function genInputs(range: number[]): Input[] {
  return range.map((val) => <Input>{ input: val, output: val })
}

/**
 * Helper to generate activated values for an Input[]
 * 
 * @param inputs - The range of inputs to calculate activated values of 
 * @param neuron - The Neuron with the required activation function
 * @returns Input[] with activated output values
 */
export function activateInputs(inputs: Input[], neuron: Neuron): Input[] {
  return inputs.map((val) => <Input>{ input: val.input, output: activate(neuron, val.output) })
}
