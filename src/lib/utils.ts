import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivationFunction, type Bias, type Layer, type Network } from "./types";

/**
 * Tailwind utility function. Provided by shadcn-svelte.
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
 * Runs an input value through the given activation function
 * 
 * @param activation - The activation function to calculate the output with
 * @param input - The input value to transform with the activation
 * @returns The activated valued of the input
 */
export function activate(activation: ActivationFunction, input: number): number {
  switch (activation) {
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
 * Calculates the weighted value of a Bias in the network
 *
 * @param node - The Bias input
 * @returns the weighted value of the Bias
 */
export function weightedBias(node: Bias): number {
  return node.input * node.weight
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
export function weightedInputs(inputs: number[], weights: number[]): number[] {
  return inputs.map((input, idx): number => {
    return input * weights[idx]
  })
}

/**
 * Computes the activated, weighted output range for the given network layer.
 *
 * @param layer - The network layer to compute the value of
 * @returns The activated, weighted output range for the layer
 */
export function layerValue(layer: Layer): number[] {
  const bias = weightedBias(layer.bias);
  const inputs = weightedInputs(layer.inputs, layer.weights);
  const weightedValue = bias + inputs.reduce((acc, curr): number => acc + curr, 0);
  return layer.neurons.map((neuron) => {
    return activate(neuron.activation, weightedValue)
  })
}

/**
 * Computes the activated, weighted output range for the given network.
 *
 * @param network - The network to compute the value of
 * @returns The activated, weighted output range for the network
 */
export function networkValue(network: Network): number[] {
  let values: number[] = network.inputs
  for (let idx = 0; idx < network.layers.length - 1; idx++) {
    values = layerValue(network.layers[idx]);
    network.layers[idx + 1].inputs = values;
  }
  return layerValue(network.layers[network.layers.length - 1])
}

