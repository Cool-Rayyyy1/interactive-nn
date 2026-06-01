import type { Act, ONeuron, TrainingPoint, Layer2Neuron } from "../types";

// Core activation functions
export function activate(x: number, type: Act): number {
  switch (type) {
    case "sign":
      return x < 0 ? -1 : 1;
    case "step":
      return x >= 0 ? 1 : 0;
    case "tanh":
      return Math.tanh(x);
    case "sigmoid":
      return 1 / (1 + Math.exp(-x));
    case "relu":
      return Math.max(0, x);
    default:
      return x;
  }
}

// Derivatives of activation functions (for backprop / gradient descent)
export function getDerivative(x: number, type: Act): number {
  const value = activate(x, type);
  switch (type) {
    case "sign":
    case "step":
      return Math.abs(x) < 2 ? 1 : 0.01;
    case "tanh":
      return 1 - value * value;
    case "sigmoid":
      return value * (1 - value);
    case "relu":
      return x > 0 ? 1 : 0.05;
    default:
      return 1;
  }
}

// Evaluates the output value of the network at (x1, x2)
export function evaluateNetwork(
  x1: number,
  x2: number,
  neurons: ONeuron[],
  bias: number,
  outputActivation: Act,
  layerCount: number = 1,
  layer2Neurons: Layer2Neuron[] = [],
  bias2: number = 0
): number {
  if (neurons.length === 0) return 0;

  // Layer 1 hidden nodes activation outputs
  const h1Outputs = neurons.map((n) => {
    const net = n.w1 * x1 + n.w2 * x2 + bias;
    return activate(net, n.act);
  });

  if (layerCount === 1) {
    if (neurons.length === 1) {
      return h1Outputs[0];
    }
    // Sum layer 1 outputs and activate
    const hSum = h1Outputs.reduce((sum, val) => sum + val, 0);
    return activate(hSum, outputActivation);
  } else {
    // 2-Layer Neural Network Mode
    if (layer2Neurons.length === 0) return 0;

    // Layer 2 hidden nodes activation outputs
    const h2Outputs = layer2Neurons.map((n) => {
      // Inputs to this node are outputs from Layer 1
      const v1Val = h1Outputs[0] || 0;
      const v2Val = h1Outputs[1] || 0;
      const v3Val = h1Outputs[2] || 0;

      const net = n.v1 * v1Val + n.v2 * v2Val + n.v3 * v3Val + bias2;
      return activate(net, n.act);
    });

    if (layer2Neurons.length === 1) {
      return h2Outputs[0];
    }

    // Sum layer 2 outputs and activate
    const hSum = h2Outputs.reduce((sum, val) => sum + val, 0);
    return activate(hSum, outputActivation);
  }
}

// Single step gradient descent or delta-rule learning over all training points
export function runTrainingEpoch(
  neurons: ONeuron[],
  bias: number,
  points: TrainingPoint[],
  learningRate: number,
  outputActivation: Act
): { updatedNeurons: ONeuron[]; updatedBias: number; loss: number } {
  let totalSquareError = 0;
  
  // Clone neurons
  const updatedNeurons = neurons.map((n) => ({ ...n }));
  let updatedBias = bias;

  if (points.length === 0) {
    return { updatedNeurons, updatedBias, loss: 0 };
  }

  // Accumulate weight updates to do batch/semi-batch gradient descent (safest and most stable)
  const d_w1 = new Array(neurons.length).fill(0);
  const d_w2 = new Array(neurons.length).fill(0);
  let d_b = 0;

  for (const p of points) {
    const { x: x1, y: x2, label } = p;
    // Map target values based on output activation function range
    // step map to 0/1, Relu map to 0/5
    let target: number = label;
    if (neurons.length === 1) {
      if (neurons[0].act === "step") {
        target = label === 1 ? 1 : 0;
      } else if (neurons[0].act === "relu") {
        target = label === 1 ? 2.5 : 0;
      }
    } else {
      if (outputActivation === "step") {
        target = label === 1 ? 1 : 0;
      } else if (outputActivation === "relu") {
        target = label === 1 ? 2.5 : 0;
      }
    }

    // Forward pass
    const netInputs = neurons.map((n) => n.w1 * x1 + n.w2 * x2 + updatedBias);
    const hHidden = netInputs.map((netIn, idx) => activate(netIn, neurons[idx].act));

    let pred = 0;
    let netOuterSum = 0;
    
    if (neurons.length === 1) {
      pred = hHidden[0];
    } else {
      netOuterSum = hHidden.reduce((a, b) => a + b, 0);
      pred = activate(netOuterSum, outputActivation);
    }

    const error = target - pred;
    totalSquareError += error * error;

    // Backward pass
    if (neurons.length === 1) {
      // Single neuron updates
      const delta = error * getDerivative(netInputs[0], neurons[0].act);
      d_w1[0] += delta * x1;
      d_w2[0] += delta * x2;
      d_b += delta;
    } else {
      // Multi-layer combination updates
      // Derivative of outer outputs
      const dOuter = getDerivative(netOuterSum, outputActivation);
      const deltaOuter = error * dOuter;

      for (let i = 0; i < neurons.length; i++) {
        // Since hidden layer to output layer is simple sum (weights = 1)
        const d_hidden = getDerivative(netInputs[i], neurons[i].act);
        const deltaHidden = deltaOuter * 1 * d_hidden;

        d_w1[i] += deltaHidden * x1;
        d_w2[i] += deltaHidden * x2;
        d_b += deltaHidden;
      }
    }
  }

  // Average gradients and apply updates
  const nPoints = points.length;
  for (let i = 0; i < neurons.length; i++) {
    updatedNeurons[i].w1 = parseFloat((updatedNeurons[i].w1 + (d_w1[i] / nPoints) * learningRate).toFixed(4));
    updatedNeurons[i].w2 = parseFloat((updatedNeurons[i].w2 + (d_w2[i] / nPoints) * learningRate).toFixed(4));
  }
  updatedBias = parseFloat((updatedBias + (d_b / nPoints) * learningRate).toFixed(4));

  return {
    updatedNeurons,
    updatedBias,
    loss: parseFloat((totalSquareError / nPoints).toFixed(6)),
  };
}
