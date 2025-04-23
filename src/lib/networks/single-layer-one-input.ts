import { ActivationFunction, type Network, type Bias, type Neuron, type Layer } from "$lib/types"
import { range } from "$lib/utils"

const inputs = range(-5, 5, 0.01);

const neuron: Neuron = {
  activation: ActivationFunction.Step
}

const bias: Bias = {
  input: 1,
  weight: 1,
}

const layer1: Layer = {
  bias,
  inputs,
  weights: Array(inputs.length).fill(1),
  neurons: [neuron],
}

export const SingleLayerOneInputNetwork: Network = {
  inputs,
  layers: [layer1],
}

