import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivationFunction, type Layer, type Network, type Input2d, type Weight, type Input3d, type Input } from "./types";

const BIAS = 1;

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
 * Generates inputs to the Neural Network from an input layer size and range of values.
 *
 * @param size How many inputs in the input layer. Only 1 or 2 is supported.
 * @param range The range of values to generate inputs from.
 * @returns Inputs as a number[][]
 */
export function genInputs(size: 1 | 2, range: number[]): Input[] {
  const output: Input[] = [];

  switch (size) {
    case 1:
      range.forEach((val) => {
        output.push(<Input>{ value: [BIAS, val] })
      })
      return output
    case 2:
      range.forEach((val1) => {
        range.forEach((val2) => {
          output.push(<Input>{ value: [BIAS, val1, val2] })
        })
      })
      return output
  }
}

/**
 * Generates inputs to the Neural Network from an input layer size and range of values.
 *
 * @param size How many inputs in the input layer. Only 1 or 2 is supported.
 * @param range The range of values to generate inputs from.
 * @returns Inputs as a number[][]
 */
export function genWeights(inputs: number, neurons: number): Weight[][] {
  const weights: Weight[][] = []
  for (let idx_a = 0; idx_a < neurons; idx_a++) {
    const local: Weight[] = []
    for (let idx_b = 0; idx_b < inputs; idx_b++) {
      local.push(<Weight>{ value: 1 })
    }
    weights.push(local)
  }
  return weights;
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
 * Calculates the weighted input range to the network for a given
 * ProductNode. It returns a range of Inputs, which contain the original input
 * and its transformed value at the given location in the network, due to the
 * interactive structure of this application
 *
 * @param node - The ProductNode Input
 * @returns The ranged of weighted inputs
 */
export function weightedInput(input: Input, weight: Weight[]): Input {
  const weighted = input.value.map((i, idx) => {
    return weight[idx].value * i
  })
  const reduced = weighted.reduce((acc, curr) => acc + curr, 0)
  return <Input>{ value: [reduced] }
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
export function weightedInputs(inputs: Input[], weights: Weight[][]): Input[] {
  const weighted: Input[] = []
  weights.forEach((weight) => {
    inputs.map((input) => {
      weighted.push(weightedInput(input, weight))
    })
  })
  return weighted
}

/**
 * Computes the activated, weighted output range for the given network layer.
 *
 * @param layer - The network layer to compute the value of
 * @returns The activated, weighted output range for the layer
 */
export function layerValue(inputs: Input[], layer: Layer): Input[] {
  const step = inputs.length
  const size = step * layer.neurons.length
  const weightedValues = weightedInputs(inputs, layer.weights)

  for (let idx = 0; idx < size; idx++) {
    const activation = layer.neurons[Math.floor(idx / step)]
    weightedValues[idx] = <Input>{
      value: weightedValues[idx].value.map((val) => {
        return activate(activation.activation, val)
      })
    }
  }

  return weightedValues
}

/**
 * Computes the activated, weighted output range for the given network.
 *
 * @param network - The network to compute the value of
 * @returns The activated, weighted output range for the network
 */
export function networkValue2d(network: Network): Input2d[] {
  const inputs: Input[] = network.inputs
  let outputs: Input[] = network.inputs

  for (let idx = 0; idx < network.layers.length - 1; idx++) {
    outputs = layerValue(outputs, network.layers[idx])
    outputs = outputs.map((input) => {
      input = <Input>{ value: [BIAS, ...input.value] }
      return input
    })
  }

  outputs = layerValue(outputs, network.layers[network.layers.length - 1])

  return inputs.map((i, idx) => {
    return <Input2d>{ input: i.value[1], output: outputs[idx].value[0] }
  })
}

/**
 * Computes the activated, weighted output range for the given network.
 *
 * @param network - The network to compute the value of
 * @returns The activated, weighted output range for the network
 */
export function networkValue3d(network: Network): Input3d[] {
  const inputs: Input[] = network.inputs
  let outputs: Input[] = network.inputs

  for (let idx = 0; idx < network.layers.length - 1; idx++) {
    outputs = layerValue(outputs, network.layers[idx])
    outputs = outputs.map((input) => {
      input = <Input>{ value: [BIAS, ...input.value] }
      return input
    })
  }

  outputs = layerValue(outputs, network.layers[network.layers.length - 1])

  return inputs.map((i, idx) => {
    return <Input3d>{ input_x1: i.value[1], input_x2: i.value[2], output: outputs[idx].value[0] }
  })
}

