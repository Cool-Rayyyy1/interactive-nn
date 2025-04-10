import { expect, test } from 'vitest';
import { activateInputs, genInputs, layerValue, networkValue, range, relu, sigmoid, weightedBias } from './utils';
import { ActivationFunction, type BiasNode, type Input, type InputLayer, type Network, type Neuron, type ProductNode } from './types';

const bias1: BiasNode = {
  input: { input: 1, output: 1 },
  weight: 2,
}

const node1: ProductNode = {
  weight: 3,
  inputs: genInputs(range(1, 4, 1)),
}

const node2: ProductNode = {
  weight: 2,
  inputs: genInputs(range(1, 4, 1)),
}

const node3: ProductNode = {
  weight: 1,
  inputs: genInputs(range(-5, 5, 1)),
}

const neuron1: Neuron = {
  activation: ActivationFunction.ReLU
}

const neuron2: Neuron = {
  activation: ActivationFunction.Step
}

const layer1: InputLayer = {
  bias: bias1,
  values: [node1, node2],
  neuron: neuron1,
}

const network1: Network = {
  input: layer1
}

const layer2: InputLayer = {
  bias: bias1,
  values: [node3],
  neuron: neuron2,
}

const network2: Network = {
  input: layer2
}

const inputn5: Input = {
  input: -5,
  output: -1
}

const inputn4: Input = {
  input: -4,
  output: -1
}

const inputn3: Input = {
  input: -3,
  output: -1
}

const inputn2: Input = {
  input: -2,
  output: 0
}

const inputn1: Input = {
  input: -1,
  output: 1
}

const input0: Input = {
  input: 0,
  output: 1
}

const input1: Input = {
  input: 1,
  output: 1
}

const input2: Input = {
  input: 2,
  output: 1
}

const input3: Input = {
  input: 3,
  output: 1
}

const input4: Input = {
  input: 4,
  output: 1
}

test('WeightedBias1', () => {
  let value = weightedBias(bias1);

  expect(value).toEqual(<Input>{ input: 1, output: 2 });
});

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

test('ActivateInputs', () => {
  let value = activateInputs(genInputs(range(-2, 3, 1)), neuron2)

  let expected: Input[] = [{ input: -2, output: -1 }, { input: -1, output: -1 }, { input: 0, output: 0 }, { input: 1, output: 1 }, { input: 2, output: 1 }]

  expect(value).toEqual(expected);
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

test('LayerValue1', () => {
  let value = layerValue(layer1);

  let expected: Input[] = [{ input: 1, output: 7 }, { input: 2, output: 12 }, { input: 3, output: 17 }]

  expect(value).toEqual(expected);
});

test('NetworkValue1', () => {
  let value = networkValue(network1)

  let expected: Input[] = [{ input: 1, output: 7 }, { input: 2, output: 12 }, { input: 3, output: 17 }]

  expect(value).toEqual(expected);
});


test('NetworkValue2', () => {
  let value = networkValue(network2)

  expect(value).toEqual([inputn5, inputn4, inputn3, inputn2, inputn1, input0, input1, input2, input3, input4]);
});
