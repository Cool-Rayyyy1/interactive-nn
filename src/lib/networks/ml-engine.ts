export type ActivationType = 'relu' | 'sigmoid' | 'tanh';

export interface LayerConfig {
  neurons: number;
  activation: ActivationType;
}

export interface NetworkState {
  weights: number[][][];
  biases: number[][];    
  layers: number[];      
  activations: ActivationType[];
}

export class NeuralNetwork {
  weights: number[][][] = [];
  biases: number[][] = [];
  layers: number[];
  activations: ActivationType[];
  learningRate: number = 0.1;

  constructor(layers: number[], activations: ActivationType[]) {
    this.layers = layers;
    this.activations = activations;

    // Initialize weights and biases
    for (let i = 0; i < layers.length - 1; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];
      for (let j = 0; j < layers[i + 1]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < layers[i]; k++) {
          // Xavier/Glorot initialization
          const limit = Math.sqrt(6 / (layers[i] + layers[i + 1]));
          neuronWeights.push(Math.random() * 2 * limit - limit);
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(0);
      }
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }

  static activate(x: number, type: ActivationType): number {
    switch (type) {
      case 'relu': return Math.max(0, x);
      case 'sigmoid': return 1 / (1 + Math.exp(-x));
      case 'tanh': return Math.tanh(x);
      default: return x;
    }
  }

  static activateDerivative(x: number, type: ActivationType): number {
    switch (type) {
      case 'relu': return x > 0 ? 1 : 0;
      case 'sigmoid': {
        const s = 1 / (1 + Math.exp(-x));
        return s * (1 - s);
      }
      case 'tanh': {
        const t = Math.tanh(x);
        return 1 - t * t;
      }
      default: return 1;
    }
  }

  softmax(outputs: number[]): number[] {
    const max = Math.max(...outputs);
    const exps = outputs.map(x => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sum);
  }

  forward(input: number[]): { outputs: number[][], zValues: number[][] } {
    const outputs: number[][] = [input];
    const zValues: number[][] = [[]]; // Input layer has no z

    let current = input;
    for (let i = 0; i < this.weights.length; i++) {
      const nextZ: number[] = [];
      const nextA: number[] = [];
      const layerWeights = this.weights[i];
      const layerBiases = this.biases[i];

      for (let j = 0; j < layerWeights.length; j++) {
        let z = layerBiases[j];
        for (let k = 0; k < layerWeights[j].length; k++) {
          z += layerWeights[j][k] * current[k];
        }
        nextZ.push(z);
        if (i === this.weights.length - 1) {
          // Last layer is handled by softmax later if needed, 
          // but for internal consistency we just store z
          nextA.push(z); 
        } else {
          nextA.push(NeuralNetwork.activate(z, this.activations[i]));
        }
      }
      
      if (i === this.weights.length - 1) {
        const soft = this.softmax(nextA);
        outputs.push(soft);
      } else {
        outputs.push(nextA);
      }
      zValues.push(nextZ);
      current = outputs[outputs.length - 1];
    }

    return { outputs, zValues };
  }

  train(input: number[], target: number[]): number {
    const { outputs, zValues } = this.forward(input);
    const finalOutput = outputs[outputs.length - 1];
    
    // Cross-entropy loss
    const loss = -target.reduce((sum, t, i) => sum + t * Math.log(finalOutput[i] + 1e-15), 0);

    // backpropagation
    let deltas: number[] = finalOutput.map((o, i) => o - target[i]); // softmax and Cross-Entropy derivative

    for (let i = this.weights.length - 1; i >= 0; i--) {
      const layerWeights = this.weights[i];
      const layerBiases = this.biases[i];
      const prevA = outputs[i];
      const currentZ = zValues[i + 1];

      const nextDeltas: number[] = new Array(this.layers[i]).fill(0);

      for (let j = 0; j < layerWeights.length; j++) {
        const delta = deltas[j];
        
        // update bias
        layerBiases[j] -= this.learningRate * delta;

        for (let k = 0; k < layerWeights[j].length; k++) {
          // accumulate delta for next layer
          nextDeltas[k] += layerWeights[j][k] * delta;
          
          // Update weight
          layerWeights[j][k] -= this.learningRate * delta * prevA[k];
        }
      }

      if (i > 0) {
        deltas = nextDeltas.map((d, idx) => d * NeuralNetwork.activateDerivative(zValues[i][idx], this.activations[i - 1]));
      }
    }

    return loss;
  }

  getState(): NetworkState {
    return {
      weights: JSON.parse(JSON.stringify(this.weights)),
      biases: JSON.parse(JSON.stringify(this.biases)),
      layers: [...this.layers],
      activations: [...this.activations]
    };
  }
}
