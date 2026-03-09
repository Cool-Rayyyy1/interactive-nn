import { expect, test } from 'vitest';
import { genInputs, genWeights, layerValue, networkValue2d, range, relu, sigmoid, weightedInput, weightedInputs } from './utils';
import { ActivationFunction, Network, type Input, type Input2d, type Layer, type Neuron, type Weight } from './types';

test('ActivateStep1', () => {
  const value = Math.sign(-10);

  expect(value).toEqual(-1);
});

test('ActivateStep2', () => {
  const value = Math.sign(10);

  expect(value).toEqual(1);
});

test('ActivateStep3', () => {
  const value = Math.sign(0);

  expect(value).toEqual(0);
});

test('ActivateSigmoid1', () => {
  const value = +sigmoid(2).toFixed(2);

  expect(value).toEqual(0.88);
});

test('ActivateSigmoid2', () => {
  const value = +sigmoid(1).toFixed(2);

  expect(value).toEqual(0.73);
});

test('ActivateRelu1', () => {
  const value = relu(-10);

  expect(value).toEqual(0);
});

test('ActivateRelu2', () => {
  const value = relu(1);

  expect(value).toEqual(1);
});

test('ActivateTanh1', () => {
  const value = +Math.tanh(1).toFixed(2);

  expect(value).toEqual(0.76);
});

test('ActivateTanh2', () => {
  const value = +Math.tanh(-2).toFixed(2);

  expect(value).toEqual(-0.96);
});


test('GenInputs1', () => {
  const inputs = genInputs(1, range(-1, 2, 1))

  const expected: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]

  expect(inputs).toEqual(expected);
});

test('GenInputs2', () => {
  const inputs = genInputs(2, range(-1, 2, 1))

  const expected: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]

  expect(inputs).toEqual(expected);
});

// Test one layer network with a bias, 1x input, 1x neuron = 2 Weights
test('GenWeights1', () => {
  const weights = genWeights(1 + 1, 1)

  const expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]

  expect(weights).toEqual(expected);
});


// Test one layer network with a bias, 2x input, 1x neuron = 3 Weights
test('GenWeights2', () => {
  const weights = genWeights(2 + 1, 1)

  const expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]

  expect(weights).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('GenWeights3', () => {
  const weights = genWeights(2 + 1, 4)

  const expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
  ]

  expect(weights).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput1', () => {
  const input = <Input>{ value: [1, 2] }
  const weight = [<Weight>{ value: 1 }, <Weight>{ value: 1 }]

  const weighted = weightedInput(input, weight)
  const expected = <Input>{ value: [3] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput2', () => {
  const input = <Input>{ value: [1, 2, 3] }
  const weight = [<Weight>{ value: 1 }, <Weight>{ value: 1 }, <Weight>{ value: 1 }]

  const weighted = weightedInput(input, weight)
  const expected = <Input>{ value: [6] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput3', () => {
  const input = <Input>{ value: [1, 2, 3] }
  const weight = [<Weight>{ value: 3 }, <Weight>{ value: 3 }, <Weight>{ value: 3 }]

  const weighted = weightedInput(input, weight)
  const expected = <Input>{ value: [18] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs1', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const weighted = weightedInputs(inputs, weights)

  const expected = [
    { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs2', () => {
  const inputs = genInputs(2, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(2 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const weighted = weightedInputs(inputs, weights)

  const expected = [
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [2] },
    { value: [1] }, { value: [2] }, { value: [3] },
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs3', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights: Weight[][] = [
    [{ value: 3 }, { value: -3 }]
  ]

  const weighted = weightedInputs(inputs, weights)

  const expected = [
    { value: [6] }, { value: [3] }, { value: [0] }
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs4', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 2)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const weighted = weightedInputs(inputs, weights)

  const expected = [
    { value: [0, 0] }, { value: [1, 1] }, { value: [2, 2] },
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs5', () => {
  const inputs = genInputs(2, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(2 + 1, 2)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const weighted = weightedInputs(inputs, weights)

  const expected = [
    { value: [-1, -1] }, { value: [0, 0] }, { value: [1, 1] },
    { value: [0, 0] }, { value: [1, 1] }, { value: [2, 2] },
    { value: [1, 1] }, { value: [2, 2] }, { value: [3, 3] },
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValueMeta1', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
  }

  const step = layer1.inputs.length
  const size = step * layer1.neurons.length

  expect(3).toEqual(step)
  expect(3).toEqual(size)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValueMeta2', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 2)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.ReLU }]
  }

  const step = layer1.inputs.length
  const size = step * layer1.neurons.length

  expect(3).toEqual(step)
  expect(6).toEqual(size)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue1', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
  }

  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue2', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue3', () => {
  const inputs = genInputs(1, range(-3, 4, 1))
  const expectedInputs: Input[] = [
    { value: [1, -3] }, { value: [1, -2] }, { value: [1, -1] }, { value: [1, 0] },
    { value: [1, 1] }, { value: [1, 2] }, { value: [1, 3] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [-1] }, { value: [-1] }, { value: [0] }, { value: [1] }, { value: [1] }, { value: [1] }, { value: [1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue4', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 2)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.Step }]
  }
  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [0, 0] }, { value: [1, 1] }, { value: [1, 1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue5', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(1 + 1, 2)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.ReLU }]
  }
  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [0, 0] }, { value: [1, 1] }, { value: [1, 2] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue5', () => {
  const inputs = genInputs(2, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights = genWeights(2 + 1, 1)
  const expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
  ]
  expect(weights).toEqual(expectedWeights);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  const value = layerValue(inputs, layer1);

  const expected: Input[] = [
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [1] },
    { value: [1] }, { value: [1] }, { value: [1] },
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('TwoLayerNetworkValue1', () => {
  const inputs = genInputs(1, range(-1, 2, 1))
  const expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  const weights1 = genWeights(1 + 1, 2)
  const expectedWeights1: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights1).toEqual(expectedWeights1);

  const weights2 = genWeights(2 + 1, 1)
  const expectedWeights2: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
  ]
  expect(weights2).toEqual(expectedWeights2);

  const layer1: Layer = {
    inputs: inputs,
    weights: weights1,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.Step }]
  }

  const layer2: Layer = {
    inputs: [],
    weights: weights2,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  const network1: Network = {
    inputs: inputs,
    layers: [layer1, layer2],
  }

  const value = networkValue2d(network1);

  const expected: Input2d[] = [
    { input: -1, output: 1 },
    { input: 0, output: 1 },
    { input: 1, output: 1 },
  ]

  expect(value).toEqual(expected)
});


