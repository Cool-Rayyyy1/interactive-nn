import { ActivationFunction, type Network, type Neuron, type Layer } from "$lib/types"
import { genInputs, genWeights, range } from "$lib/utils"

const SIZE = 1

const values = range(-5, 5, 0.01);
const inputs = genInputs(SIZE, values);

const neurons1: Neuron[] = [
  { activation: ActivationFunction.Step },
  { activation: ActivationFunction.Step }
]

const neurons2: Neuron[] = [
  { activation: ActivationFunction.Step },
]

const layer1: Layer = {
  inputs: inputs,
  weights: genWeights(SIZE + 1, neurons1.length),
  neurons: neurons1,
}

const layer2: Layer = {
  inputs: [],
  weights: genWeights(2 + 1, neurons2.length),
  neurons: neurons2,
}

export const TwoLayerOneInputNetwork: Network = {
  inputs: inputs,
  layers: [layer1, layer2],
}
