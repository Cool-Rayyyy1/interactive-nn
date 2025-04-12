import { ActivationFunction, type Network, type BiasNode, type InputLayer, type Neuron, type ProductNode } from "$lib/types"
import { genInputs, range } from "$lib/utils"

const neuron: Neuron = {
  activation: ActivationFunction.Step
}

const bias: BiasNode = {
  weight: 1,
  input: {
    input: 1,
    output: 1
  }
}

const values: ProductNode[] = [
  {
    weight: 1,
    inputs: genInputs(range(-5, 5, 1))
  },
  {
    weight: 1,
    inputs: genInputs(range(-5, 5, 1))
  }
]

const inputLayer: InputLayer = {
  bias,
  values,
  neuron,
}

export const SingleLayerTwoInputNetwork: Network = {
  input: inputLayer
}

