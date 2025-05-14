import { expect, test } from 'vitest';
import { genInputs, genWeights, layerValue, range, relu, sigmoid, weightedInput, weightedInputs } from './utils';
import { ActivationFunction, type Input, type Layer, type Neuron, type Weight } from './types';

test('ActivateStep1', () => {
  let value = Math.sign(-10);

  expect(value).toEqual(-1);
});

test('ActivateStep2', () => {
  let value = Math.sign(10);

  expect(value).toEqual(1);
});

test('ActivateStep3', () => {
  let value = Math.sign(0);

  expect(value).toEqual(0);
});

test('ActivateSigmoid1', () => {
  let value = +sigmoid(2).toFixed(2);

  expect(value).toEqual(0.88);
});

test('ActivateSigmoid2', () => {
  let value = +sigmoid(1).toFixed(2);

  expect(value).toEqual(0.73);
});

test('ActivateRelu1', () => {
  let value = relu(-10);

  expect(value).toEqual(0);
});

test('ActivateRelu2', () => {
  let value = relu(1);

  expect(value).toEqual(1);
});

test('ActivateTanh1', () => {
  let value = +Math.tanh(1).toFixed(2);

  expect(value).toEqual(0.76);
});

test('ActivateTanh2', () => {
  let value = +Math.tanh(-2).toFixed(2);

  expect(value).toEqual(-0.96);
});


test('GenInputs1', () => {
  let inputs = genInputs(1, range(-1, 2, 1))

  let expected: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]

  expect(inputs).toEqual(expected);
});

test('GenInputs2', () => {
  let inputs = genInputs(2, range(-1, 2, 1))

  let expected: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]

  expect(inputs).toEqual(expected);
});

// Test one layer network with a bias, 1x input, 1x neuron = 2 Weights
test('GenWeights1', () => {
  let weights = genWeights(1 + 1, 1)

  let expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]

  expect(weights).toEqual(expected);
});


// Test one layer network with a bias, 2x input, 1x neuron = 3 Weights
test('GenWeights2', () => {
  let weights = genWeights(2 + 1, 1)

  let expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]

  expect(weights).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('GenWeights3', () => {
  let weights = genWeights(2 + 1, 4)

  let expected: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }],
  ]

  expect(weights).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput1', () => {
  let input = <Input>{ value: [1, 2] }
  let weight = [<Weight>{ value: 1 }, <Weight>{ value: 1 }]

  let weighted = weightedInput(input, weight)
  let expected = <Input>{ value: [3] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput2', () => {
  let input = <Input>{ value: [1, 2, 3] }
  let weight = [<Weight>{ value: 1 }, <Weight>{ value: 1 }, <Weight>{ value: 1 }]

  let weighted = weightedInput(input, weight)
  let expected = <Input>{ value: [6] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInput3', () => {
  let input = <Input>{ value: [1, 2, 3] }
  let weight = [<Weight>{ value: 3 }, <Weight>{ value: 3 }, <Weight>{ value: 3 }]

  let weighted = weightedInput(input, weight)
  let expected = <Input>{ value: [18] }

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs1', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let weighted = weightedInputs(inputs, weights)

  let expected = [
    { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs2', () => {
  let inputs = genInputs(2, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(2 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let weighted = weightedInputs(inputs, weights)

  let expected = [
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [2] },
    { value: [1] }, { value: [2] }, { value: [3] },
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs3', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights: Weight[][] = [
    [{ value: 3 }, { value: -3 }]
  ]

  let weighted = weightedInputs(inputs, weights)

  let expected = [
    { value: [6] }, { value: [3] }, { value: [0] }
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs4', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 2)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let weighted = weightedInputs(inputs, weights)

  let expected = [
    { value: [0] }, { value: [1] }, { value: [2] },
    { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('WeightedInputs5', () => {
  let inputs = genInputs(2, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(2 + 1, 2)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let weighted = weightedInputs(inputs, weights)

  let expected = [
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [2] },
    { value: [1] }, { value: [2] }, { value: [3] },
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [2] },
    { value: [1] }, { value: [2] }, { value: [3] },
  ]

  expect(weighted).toEqual(expected);
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValueMeta1', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
  }

  let step = layer1.inputs.length
  let size = step * layer1.neurons.length

  expect(3).toEqual(step)
  expect(3).toEqual(size)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValueMeta2', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 2)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.ReLU }]
  }

  let step = layer1.inputs.length
  let size = step * layer1.neurons.length

  expect(3).toEqual(step)
  expect(6).toEqual(size)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue1', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
  }

  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue2', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue3', () => {
  let inputs = genInputs(1, range(-3, 4, 1))
  let expectedInputs: Input[] = [
    { value: [1, -3] }, { value: [1, -2] }, { value: [1, -1] }, { value: [1, 0] },
    { value: [1, 1] }, { value: [1, 2] }, { value: [1, 3] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [-1] }, { value: [-1] }, { value: [0] }, { value: [1] }, { value: [1] }, { value: [1] }, { value: [1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue4', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 2)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.Step }]
  }
  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [1] }, { value: [0] }, { value: [1] }, { value: [1] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue5', () => {
  let inputs = genInputs(1, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1] }, { value: [1, 0] }, { value: [1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(1 + 1, 2)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }],
    [{ value: 1 }, { value: 1 }]
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.ReLU }]
  }
  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [0] }, { value: [1] }, { value: [1] }, { value: [0] }, { value: [1] }, { value: [2] }
  ]

  expect(value).toEqual(expected)
});

// Test one layer network with a bias, 2x input, 4x neuron = 12 Weights
test('LayerValue5', () => {
  let inputs = genInputs(2, range(-1, 2, 1))
  let expectedInputs: Input[] = [
    { value: [1, -1, -1] }, { value: [1, -1, 0] }, { value: [1, -1, 1] },
    { value: [1, 0, -1] }, { value: [1, 0, 0] }, { value: [1, 0, 1] },
    { value: [1, 1, -1] }, { value: [1, 1, 0] }, { value: [1, 1, 1] }
  ]
  expect(inputs).toEqual(expectedInputs);

  let weights = genWeights(2 + 1, 1)
  let expectedWeights: Weight[][] = [
    [{ value: 1 }, { value: 1 }, { value: 1 }],
  ]
  expect(weights).toEqual(expectedWeights);

  let layer1: Layer = {
    inputs: inputs,
    weights: weights,
    neurons: [<Neuron>{ activation: ActivationFunction.Step }]
  }

  let value = layerValue(layer1);

  let expected: Input[] = [
    { value: [-1] }, { value: [0] }, { value: [1] },
    { value: [0] }, { value: [1] }, { value: [1] },
    { value: [1] }, { value: [1] }, { value: [1] },
  ]

  expect(value).toEqual(expected)
});


