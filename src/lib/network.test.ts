import { expect, test } from 'vitest';
import { layerValue, networkValue, range, relu, sigmoid, weightedBias, weightedInputs } from './utils';
import { ActivationFunction, type Bias, type Layer, type Network, type Neuron } from './types';

const inputs1: number[] = range(-5, 5, 1);

const inputs2: number[] = range(0, 5, 1);

const bias1: Bias = {
  input: 1,
  weight: 2,
}

const weights1: number[] = Array(10).fill(1);

const weights2: number[] = Array(10).fill(2);

const neuron1: Neuron = {
  activation: ActivationFunction.ReLU,
}

const neuron2: Neuron = {
  activation: ActivationFunction.Step,
}

const layer1: Layer = {
  bias: bias1,
  inputs: inputs1,
  weights: weights1,
  neurons: [neuron1],
}

const layer2: Layer = {
  bias: bias1,
  inputs: inputs1,
  weights: weights2,
  neurons: [neuron1],
}

const layer3: Layer = {
  bias: bias1,
  inputs: inputs2,
  weights: weights1,
  neurons: [neuron1],
}

const layer4: Layer = {
  bias: bias1,
  inputs: inputs1,
  weights: weights1,
  neurons: [neuron2],
}

const layer5: Layer = {
  bias: bias1,
  inputs: inputs2,
  weights: weights1,
  neurons: [neuron2],
}

const network1: Network = {
  inputs: inputs1,
  layers: [layer1],
}

const network2: Network = {
  inputs: inputs1,
  layers: [layer2],
}

const network3: Network = {
  inputs: inputs2,
  layers: [layer3],
}

const network4: Network = {
  inputs: inputs1,
  layers: [layer4],
}

const network5: Network = {
  inputs: inputs2,
  layers: [layer5],
}

const network6: Network = {
  inputs: inputs2,
  layers: [layer3, layer5],
}

const network7: Network = {
  inputs: inputs2,
  layers: [layer3, layer3],
}

const layer8: Layer = {
  bias: { input: 1, weight: 2 },
  inputs: range(0, 5, 1),
  weights: Array(10).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
}

const network8: Network = {
  inputs: range(0, 5, 1),
  layers: [layer8, layer8, layer8, layer8],
}

const layer9a: Layer = {
  bias: { input: 1, weight: 2 },
  inputs: range(0, 5, 1),
  weights: Array(10).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.Step }]
}

const layer9b: Layer = {
  bias: { input: 1, weight: 2 },
  inputs: range(0, 5, 1),
  weights: Array(10).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }]
}

const network9: Network = {
  inputs: range(0, 5, 1),
  layers: [layer9a, layer9b],
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

test('WeightedInputs1', () => {
  let value = weightedInputs(layer1.inputs, layer1.weights);

  let expected: number[] = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]

  expect(value).toEqual(expected);
});

test('WeightedInputs2', () => {
  let value = weightedInputs(layer2.inputs, layer2.weights);

  let expected: number[] = [-10, - 8, -6, -4, -2, 0, 2, 4, 6, 8]

  expect(value).toEqual(expected);
});

test('WeightedInputs3', () => {
  let value = weightedInputs(layer3.inputs, layer3.weights);

  let expected: number[] = [0, 1, 2, 3, 4]

  expect(value).toEqual(expected);
});

test('LayerValue1', () => {
  let value = layerValue(layer1);

  let expected: number[] = [0]

  expect(value).toEqual(expected);
});

test('NetworkValue1', () => {
  let value = networkValue(network1)

  let expected: number[] = [0]

  expect(value).toEqual(expected);
});

test('LayerValue2', () => {
  let value = layerValue(layer2);

  let expected: number[] = [0]

  expect(value).toEqual(expected);
});

test('NetworkValue2', () => {
  let value = networkValue(network2)

  let expected: number[] = [0]

  expect(value).toEqual(expected);
});

test('LayerValue3', () => {
  let value = layerValue(layer3);

  let expected: number[] = [12]

  expect(value).toEqual(expected);
});

test('NetworkValue3', () => {
  let value = networkValue(network3)

  let expected: number[] = [12]

  expect(value).toEqual(expected);
});

test('LayerValue4', () => {
  let value = layerValue(layer4);

  let expected: number[] = [-1]

  expect(value).toEqual(expected);
});

test('NetworkValue4', () => {
  let value = networkValue(network4)

  let expected: number[] = [-1]

  expect(value).toEqual(expected);
});


test('LayerValue5', () => {
  let value = layerValue(layer5);

  let expected: number[] = [1]

  expect(value).toEqual(expected);
});

test('NetworkValue5', () => {
  let value = networkValue(network5)

  let expected: number[] = [1]

  expect(value).toEqual(expected);
});

test('NetworkValue6', () => {
  let value = networkValue(network6)

  let expected: number[] = [1]

  expect(value).toEqual(expected);
});


test('NetworkValue7', () => {
  let value = networkValue(network7)

  let expected: number[] = [14]

  expect(value).toEqual(expected);
});

test('NetworkValue8', () => {
  let value = networkValue(network8)

  let expected: number[] = [18]

  expect(value).toEqual(expected);
});

test('NetworkValue9', () => {
  let value = networkValue(network9)

  let expected: number[] = [3]

  expect(value).toEqual(expected);
});

const layer10: Layer = {
  bias: { input: 1, weight: 3 },
  inputs: range(0, 5, 1),
  weights: Array(10).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.ReLU }]
}

const network10: Network = {
  inputs: range(0, 5, 1),
  layers: [layer10],
}

test('LayerValue10', () => {
  let value = layerValue(layer10);

  let expected: number[] = [13, 13]

  expect(value).toEqual(expected);
});

test('NetworkValue10', () => {
  let value = networkValue(network10)

  let expected: number[] = [13, 13]

  expect(value).toEqual(expected);
});

const layer11: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: range(0, 5, 1),
  weights: Array(11).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const network11: Network = {
  inputs: range(0, 5, 1),
  layers: [layer11],
}

test('LayerValue11', () => {
  let value = layerValue(layer11);

  let expected: number[] = [15, 1]

  expect(value).toEqual(expected);
});

test('NetworkValue11', () => {
  let value = networkValue(network11)

  let expected: number[] = [15, 1]

  expect(value).toEqual(expected);
});

const layer12a: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: range(0, 5, 1),
  weights: Array(12).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const layer12b: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: [],
  weights: Array(12).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const network12: Network = {
  inputs: range(0, 5, 1),
  layers: [layer12a, layer12b],
}

test('NetworkValue12', () => {
  let value = networkValue(network12)

  let expected: number[] = [21, 1]

  expect(value).toEqual(expected);
});

const layer13a: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: range(0, 5, 1),
  weights: Array(13).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const layer13b: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: [],
  weights: Array(13).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const layer13c: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: [],
  weights: Array(13).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.ReLU }]
}

const network13: Network = {
  inputs: range(0, 5, 1),
  layers: [layer13a, layer13b, layer13c],
}

test('NetworkValue13', () => {
  let value = networkValue(network13)

  let expected: number[] = [27, 27]

  expect(value).toEqual(expected);
});

const layer14a: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: range(0, 5, 1),
  weights: Array(14).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const layer14b: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: [],
  weights: Array(14).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.ReLU }, <Neuron>{ activation: ActivationFunction.Step }]
}

const layer14c: Layer = {
  bias: { input: 1, weight: 5 },
  inputs: [],
  weights: Array(14).fill(1),
  neurons: [<Neuron>{ activation: ActivationFunction.Step }, <Neuron>{ activation: ActivationFunction.Step }]
}

const network14: Network = {
  inputs: range(0, 5, 1),
  layers: [layer14a, layer14b, layer14c],
}

test('NetworkValue14', () => {
  let value = networkValue(network14)

  let expected: number[] = [1, 1]

  expect(value).toEqual(expected);
});

