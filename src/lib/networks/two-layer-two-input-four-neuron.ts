import { ActivationFunction, type Network, type Neuron, type Layer } from "$lib/types"
import { genInputs, genWeights, range } from "$lib/utils"

const SIZE = 2

let values = range(-5, 5, 1)
let inputs = genInputs(SIZE, values)


let neurons1: Neuron[] = [
  { activation: ActivationFunction.Step },
  { activation: ActivationFunction.Step },
  { activation: ActivationFunction.Step },
  { activation: ActivationFunction.Step }
]

let neurons2: Neuron[] = [
  { activation: ActivationFunction.Step },
]

let layer1: Layer = {
  inputs: inputs,
  weights: genWeights(SIZE + 1, neurons1.length),
  neurons: neurons1,
}

const layer2: Layer = {
  inputs: [],
  weights: genWeights(neurons1.length + 1, neurons2.length),
  neurons: neurons2,
}


export let TwoLayerTwoInputNetworkFourNeuron: Network = {
  inputs,
  layers: [layer1, layer2],
}

