import { ActivationFunction, type Network, type Neuron, type Layer } from "$lib/types"
import { genInputs, genWeights, range } from "$lib/utils"

const SIZE = 1

const values = range(-5, 5, 0.01);
const inputs = genInputs(SIZE, values);

const neurons: Neuron[] = [
  { activation: ActivationFunction.Step }
]

const layer1: Layer = {
  inputs: inputs,
  weights: genWeights(SIZE + 1, neurons.length),
  neurons: neurons,
}

export const SingleLayerOneInputNetwork: Network = {
  inputs: inputs,
  layers: [layer1],
}
