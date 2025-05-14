import { ActivationFunction, type Network, type Neuron, type Layer } from "$lib/types"
import { genInputs, genWeights, range } from "$lib/utils"

const SIZE = 2

let values = range(-5, 5, 1)
let inputs = genInputs(SIZE, values)


let neurons: Neuron[] = [
  { activation: ActivationFunction.Step }
]

let layer1: Layer = {
  inputs: inputs,
  weights: genWeights(SIZE + 1, neurons.length),
  neurons: neurons,
}

export let SingleLayerTwoInputNetwork: Network = {
  inputs,
  layers: [layer1],
}

