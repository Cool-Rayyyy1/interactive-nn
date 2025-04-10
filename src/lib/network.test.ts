import { expect, test } from 'vitest';
import { genInputs, layerValue, networkValue, range, relu, sigmoid, weightedBias } from './utils';
import { ActivationFunction, type BiasNode, type InputLayer, type Network, type Neuron, type ProductNode } from './types';

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

test('WeightedBias1', () => {
  let value = weightedBias(bias1);

  expect(value).toEqual(2);
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

  expect(value).toEqual([7, 12, 17]);
});

test('NetworkValue1', () => {
  let value = networkValue(network1)

  expect(value).toEqual([7, 12, 17]);
});


test('NetworkValue2', () => {
  let value = networkValue(network2)

  expect(value).toEqual([-1, -1, -1, 0, 1, 1, 1, 1, 1, 1]);
});
