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
 * Calculates the derivative of the sigmoid value of a given input
 *
 * @remarks 
 * Sigmoid is calculated by:
 * (sigmoid(x) / (1 - sigmoid(x))
 *
 * @param x - The input value
 * @returns The derivative sigmoid value of the input
 */
export function dx_sigmoid(x: number): number {
  return ((sigmoid(x)) * (1 - sigmoid(x)))
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
 * Calculates the derivative value of relu of a given input
 *
 * @param x - The input value
 * @returns The derivative value of the input
 */
export function dx_relu(x: number): number {
  if (x <= 0) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Returns derivative of the sgn function (i.e. 0)
 *
 * @remarks
 * As the sgn function has no slope, this always returns 0.
 *
 * @returns 0
 */
export function dx_sign(): number {
  return 0;
}

/**
 * Calculates the derivative value of tanh of a given input
 *
 * @param x - The input value
 * @returns The derivative value of the input
 */
export function dx_tanh(x: number): number {
  return 1 - Math.tanh(x) ** 2;
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
 * Runs an input value through the given activation function
 * 
 * @param activation - The activation function to calculate the output with
 * @param input - The input value to transform with the activation
 * @returns The activated valued of the input
 */
export function derive(activation: ActivationFunction, input: number): number {
  switch (activation) {
    case ActivationFunction.Step:
      return dx_sign()
    case ActivationFunction.Sigmoid:
      return dx_sigmoid(input)
    case ActivationFunction.Tanh:
      return dx_tanh(input)
    case ActivationFunction.ReLU:
      return dx_relu(input)
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
  inputs.map((input) => {
    const local: Input[] = []
    weights.forEach((weight) => {
      local.push(weightedInput(input, weight))
    })
    const reduced: Input = local.reduce((acc, curr): Input => <Input>{ value: acc.value.concat(curr.value) }, <Input>{ value: [] })
    weighted.push(reduced)
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
  const weightedValues = weightedInputs(inputs, layer.weights)

  for (let idx = 0; idx < inputs.length; idx++) {
    weightedValues[idx] = <Input>{
      value: weightedValues[idx].value.map((val, i) => {
        return activate(layer.neurons[i].activation, val)
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

/**
 * Flatten arrays of arrays one level deep
 * @param list The list to flatten
 * @param accessor An optional accessor function or string property key
 * @returns Flattened array
 */
export default function flatten<T, U>(
  list: T[],
  accessor: string | ((item: T) => U[]) = (d: T) => d as unknown as U[]
): U[] {
  // type the accessor function based on input
  const acc: (item: T) => U[] =
    typeof accessor === 'string' ? (d: T) => d[accessor as keyof T] as U[] : accessor;

  // check if list is array and first element through accessor is array
  const firstElement = list[0] && acc(list[0]);
  if (Array.isArray(list) && Array.isArray(firstElement)) {
    let flat: U[] = [];
    const l = list.length;
    for (let i = 0; i < l; i += 1) {
      flat = flat.concat(acc(list[i]));
    }
    return flat;
  }

  // type assertion here since we know list contains U[] if not flattened
  return list as unknown as U[];
}
