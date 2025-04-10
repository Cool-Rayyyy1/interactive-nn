import { expect, test } from 'vitest';
import { layerValue, networkValue, relu, sigmoid, weightedBias, weightedInput } from './utils';
import { ActivationFunction, type BiasNode, type HiddenLayer, type InputLayer, type Network, type Neuron, type ProductNode } from './types';

const bias1: BiasNode = {
  input: 1,
  weight: 2,
}

const node1: ProductNode = {
  weight: 3,
  inputs: [1, 2, 3],
}

const node2: ProductNode = {
  weight: 2,
  inputs: [1, 2, 3],
}

const neuron1: Neuron = {
  activation: ActivationFunction.ReLU
}

const layer1: InputLayer = {
  bias: bias1,
  values: [node1, node2],
  neuron: neuron1,
}

const network1: Network = {
  input: layer1
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
