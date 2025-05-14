import { ActivationFunction, type Network, type Neuron, type Layer } from "$lib/types"
import { genInputs, genWeights, range } from "$lib/utils"

const SIZE = 1

let values = range(-5, 5, 0.01);
let inputs = genInputs(SIZE, values);

let neurons: Neuron[] = [
  { activation: ActivationFunction.Step },
  { activation: ActivationFunction.Step }
]

let layer1: Layer = {
  inputs: inputs,
  weights: genWeights(SIZE + 1, neurons.length),
  neurons: neurons,
}

export let SingleLayerOneInputNetwork: Network = {
  inputs: inputs,
  layers: [layer1],
}
