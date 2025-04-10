import { ActivationFunction, Network, type Layer, type NetworkNode, type Neuron } from "$lib/types"

const bias: NetworkNode = {
  input: 1,
  weight: 1,
}

const node1: NetworkNode = {
  input: 2,
  weight: 3,
}

const node2: NetworkNode = {
  input: 3,
  weight: 2,
}

const neuron: Neuron = {
  activation: ActivationFunction.Step
}

const layer1: Layer = {
  bias: bias1,
  inputs: [node1, node2],
  neuron: neuron1,
}

const network1: Network = {
  layers: [layer1, layer1]
}


export singleLayerTwoInput: Network = {

}
