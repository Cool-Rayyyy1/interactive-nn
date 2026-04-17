import { getContext, setContext } from 'svelte';
import * as mathUtils from '$lib/math/activation';
import type { NetworkState, TrainingStep, HistoryItem, NeuronValues, GradientState, ActivationType } from '$lib/types';

const INITIAL_WEIGHTS = {
  'i0-h1_0': 0.5, 'i0-h1_1': -0.2,
  'i1-h1_0': 0.1, 'i1-h1_1': 0.4,
  'h1_0-h2_0': 0.3, 'h1_0-h2_1': -0.5,
  'h1_1-h2_0': 0.2, 'h1_1-h2_1': 0.6,
  'h2_0-o0': 0.7, 'h2_1-o0': -0.3
};

const INITIAL_BIASES = {
  'h1_0': 0.1, 'h1_1': -0.1,
  'h2_0': 0.05, 'h2_1': -0.05,
  'o0': 0.2
};

const INITIAL_NEURON_VALUES: Record<string, NeuronValues> = {
  'i0': { val: 0.5, raw: 0.5, error: 0 },
  'i1': { val: 0.8, raw: 0.8, error: 0 },
  'h1_0': { val: 0, raw: 0, error: 0 },
  'h1_1': { val: 0, raw: 0, error: 0 },
  'h2_0': { val: 0, raw: 0, error: 0 },
  'h2_1': { val: 0, raw: 0, error: 0 },
  'o0': { val: 0, raw: 0, error: 0 },
};

export const WEIGHT_NOTATION: Record<string, string> = {
  'i0-h1_0': 'w_1', 'i0-h1_1': 'w_2',
  'i1-h1_0': 'w_3', 'i1-h1_1': 'w_4',
  'h1_0-h2_0': 'w_5', 'h1_0-h2_1': 'w_6',
  'h1_1-h2_0': 'w_7', 'h1_1-h2_1': 'w_8',
  'h2_0-o0': 'w_9', 'h2_1-o0': 'w_{10}'
};

export const BIAS_NOTATION: Record<string, string> = {
  'h1_0': 'b_1', 'h1_1': 'b_2',
  'h2_0': 'b_3', 'h2_1': 'b_4',
  'o0': 'b_5'
};

export const NEURON_NOTATION: Record<string, string> = {
  'i0': 'X_1', 'i1': 'X_2',
  'h1_0': 'N_{11}', 'h1_1': 'N_{12}',
  'h2_0': 'N_{21}', 'h2_1': 'N_{22}',
  'o0': 'N_{31}'
};

export const ACTIVATION_NOTATION: Record<string, string> = {
  'i0': 'X_1', 'i1': 'X_2',
  'h1_0': 'a_{1,1}', 'h1_1': 'a_{1,2}',
  'h2_0': 'a_{2,1}', 'h2_1': 'a_{2,2}',
  'o0': 'a_{3,1}'
};

export class NeuralNetwork {
  learningRate = $state(0.1);
  target = $state(0.5);
  maxEpoch = $state(10);
  x1 = $state(0.5);
  x2 = $state(0.8);
  activationType = $state<ActivationType>('sigmoid');

  weights = $state<Record<string, number>>({ ...INITIAL_WEIGHTS });
  biases = $state<Record<string, number>>({ ...INITIAL_BIASES });
  neuronValues = $state<Record<string, NeuronValues>>({ ...INITIAL_NEURON_VALUES });
  gradients = $state<GradientState>({ weights: {}, biases: {} });
  
  step = $state<TrainingStep>('idle');
  subStep = $state(0);
  activeElement = $state<string | null>(null);
  mathDetails = $state<string | null>(null);
  symbolicMath = $state<string | null>(null);
  numericMath = $state<string | null>(null);
  history = $state<HistoryItem[]>([]);
  epoch = $state(0);
  stepHistory = $state<NetworkState[]>([]);
  isTraining = $state(false);

  private trainingInterval: any = null;

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (this.step === 'idle' && !this.isTraining) {
          this.neuronValues['i0'] = { ...this.neuronValues['i0'], val: this.x1, raw: this.x1 };
          this.neuronValues['i1'] = { ...this.neuronValues['i1'], val: this.x2, raw: this.x2 };
        }
      });

      $effect(() => {
        if (this.isTraining) {
          if (this.epoch >= this.maxEpoch) {
            this.isTraining = false;
            return;
          }
          this.trainingInterval = setInterval(() => {
            this.handleStep();
          }, 450);
        } else {
          clearInterval(this.trainingInterval);
        }
        return () => clearInterval(this.trainingInterval);
      });
    });
  }

  forwardStep(index: number) {
    const targets = ['h1_0', 'h1_1', 'h2_0', 'h2_1', 'o0'];
    if (index === 5) {
      const pred = this.neuronValues['o0'].val;
      const loss = Math.pow(this.target - pred, 2);
      this.activeElement = 'o0';
      this.symbolicMath = `L = (y - \\hat{y})^2`;
      this.numericMath = `L = (${this.target.toFixed(2)} - ${pred.toFixed(3)})^2 = ${loss.toFixed(4)}`;
      this.mathDetails = `MSE Loss = (Target - Pred)² = (${this.target.toFixed(2)} - ${pred.toFixed(3)})² = ${loss.toFixed(4)}`;
      return;
    }

    const targetId = targets[index];
    if (!targetId) return;

    this.activeElement = targetId;
    let sum = this.biases[targetId];
    let bKey = BIAS_NOTATION[targetId];
    let mathStr = `${this.biases[targetId].toFixed(2)}`;
    let numericStr = `${this.biases[targetId].toFixed(2)}`;
    
    let prevLayer: string[] = [];
    if (targetId.startsWith('h1')) prevLayer = ['i0', 'i1'];
    else if (targetId.startsWith('h2')) prevLayer = ['h1_0', 'h1_1'];
    else if (targetId.startsWith('o')) prevLayer = ['h2_0', 'h2_1'];

    let summationSymbolic = `${bKey}`;
    prevLayer.forEach(prevId => {
      const wKey = `${prevId}-${targetId}`;
      const w = this.weights[wKey];
      const v = this.neuronValues[prevId].val;
      sum += v * w;
      mathStr += ` + (${v.toFixed(2)} \\cdot ${w.toFixed(2)})`;
      numericStr += ` + (${v.toFixed(2)} \\cdot ${w.toFixed(2)})`;
      summationSymbolic += ` + (${WEIGHT_NOTATION[wKey]} \\cdot ${ACTIVATION_NOTATION[prevId]})`;
    });

    const val = this.activationType === 'sigmoid' ? mathUtils.sigmoid(sum) : this.activationType === 'tanh' ? mathUtils.tanh(sum) : mathUtils.relu(sum);
    this.neuronValues[targetId] = { ...this.neuronValues[targetId], raw: sum, val };
    
    const targetLabel = ACTIVATION_NOTATION[targetId];
    const funcName = this.activationType === 'sigmoid' ? '\\sigma' : this.activationType === 'tanh' ? '\\tanh' : '\\text{ReLU}';
    this.symbolicMath = `${targetLabel} = ${funcName}(${summationSymbolic})`;
    this.numericMath = `${targetLabel} = ${funcName}(${numericStr}) = ${val.toFixed(3)}`;
    this.mathDetails = `Σ = ${mathStr} = ${sum.toFixed(3)}\na = f(Σ) = ${val.toFixed(3)}`;
  }

  backwardStep(index: number) {
    const targets = ['h2_0', 'h2_1', 'h1_0', 'h1_1'];
    const targetId = targets[index];
    if (!targetId) return;

    this.activeElement = targetId;
    const z = this.neuronValues[targetId].raw;
    const sDeriv = this.activationType === 'sigmoid' ? mathUtils.sigmoidDeriv(z) : this.activationType === 'tanh' ? mathUtils.tanhDeriv(z) : mathUtils.reluDeriv(z);
    
    let nextLayer: string[] = [];
    if (targetId.startsWith('h2')) nextLayer = ['o0'];
    else if (targetId.startsWith('h1')) nextLayer = ['h2_0', 'h2_1'];

    let errorSum = 0;
    let mathStr = "";
    let numericStr = "";
    let symbolicChain = "";
    nextLayer.forEach((nextId, i) => {
      const wKey = `${targetId}-${nextId}`;
      const w = this.weights[wKey];
      const nextErr = this.neuronValues[nextId].error;
      errorSum += nextErr * w;
      mathStr += (i > 0 ? " + " : "") + `(${nextErr.toFixed(4)} \\cdot ${w.toFixed(2)})`;
      numericStr += (i > 0 ? " + " : "") + `(${nextErr.toFixed(4)} \\cdot ${w.toFixed(2)})`;
      symbolicChain += (i > 0 ? " + " : "") + `(\\nabla_{${ACTIVATION_NOTATION[nextId]}} \\cdot ${WEIGHT_NOTATION[wKey]})`;
    });

    const h_error = errorSum * sDeriv;
    this.neuronValues[targetId].error = h_error;
    
    const targetLabel = ACTIVATION_NOTATION[targetId];
    const funcNameDeriv = this.activationType === 'sigmoid' ? "\\sigma'" : this.activationType === 'tanh' ? "\\tanh'" : "\\text{ReLU}'";
    this.symbolicMath = `\\nabla_{${targetLabel}} = (${symbolicChain}) \\cdot ${funcNameDeriv}(${targetLabel})`;
    this.numericMath = `\\nabla_{${targetLabel}} = (${numericStr}) \\cdot ${sDeriv.toFixed(3)} = ${h_error.toFixed(4)}`;
    this.mathDetails = `∇ = (Σ(∇_next · w)) · f'\n∇ = (${mathStr}) · ${sDeriv.toFixed(3)} = ${h_error.toFixed(4)}`;

    let prevLayer: string[] = [];
    if (targetId.startsWith('h2')) prevLayer = ['h1_0', 'h1_1'];
    else if (targetId.startsWith('h1')) prevLayer = ['i0', 'i1'];

    prevLayer.forEach(prevId => {
      this.gradients.weights[`${prevId}-${targetId}`] = h_error * this.neuronValues[prevId].val;
    });
    this.gradients.biases[targetId] = h_error;
  }

  updateStep(index: number) {
    const weightKeys = Object.keys(this.weights);
    const biasKeys = Object.keys(this.biases);
    
    if (index < weightKeys.length) {
      const k = weightKeys[index];
      const [fromId, toId] = k.split('-');
      const grad = this.gradients.weights[k];
      const error = this.neuronValues[toId].error;
      const input = this.neuronValues[fromId].val;
      
      const oldW = this.weights[k];
      this.weights[k] -= this.learningRate * grad;
      this.activeElement = k;
      const wNotation = WEIGHT_NOTATION[k];
      this.symbolicMath = `${wNotation}^{(new)} = ${wNotation}^{(old)} - \\eta \\cdot \\nabla_{${wNotation}}`;
      this.numericMath = `${wNotation} = ${oldW.toFixed(3)} - (${this.learningRate.toFixed(2)} \\cdot ${grad.toFixed(4)}) = ${this.weights[k].toFixed(3)}`;
      this.mathDetails = `Update: Weight\n∇_w = ∇_out · a_in\n∇_w = ${error.toFixed(4)} · ${input.toFixed(3)} = ${grad.toFixed(4)}\nw_new = w_old - (η · ∇_w)\nw_new = ${oldW.toFixed(3)} - (${this.learningRate.toFixed(2)} · ${grad.toFixed(4)}) = ${this.weights[k].toFixed(3)}`;
    } else {
      const bIdx = index - weightKeys.length;
      const k = biasKeys[bIdx];
      if (!k) return;
      const grad = this.gradients.biases[k];
      const error = this.neuronValues[k].error;
      
      const oldB = this.biases[k];
      this.biases[k] -= this.learningRate * grad;
      this.activeElement = k;
      const bNotation = BIAS_NOTATION[k];
      this.symbolicMath = `${bNotation}^{(new)} = ${bNotation}^{(old)} - \\eta \\cdot \\nabla_{${bNotation}}`;
      this.numericMath = `${bNotation} = ${oldB.toFixed(3)} - (${this.learningRate.toFixed(2)} \\cdot ${grad.toFixed(4)}) = ${this.biases[k].toFixed(3)}`;
      this.mathDetails = `Update: Bias\n∇_b = ∇_out\n∇_b = ${error.toFixed(4)}\nb_new = b_old - (η · ∇_b)\nb_new = ${oldB.toFixed(3)} - (${this.learningRate.toFixed(2)} · ${grad.toFixed(4)}) = ${this.biases[k].toFixed(3)}`;
    }
  }

  handleStep() {
    this.stepHistory.push({
      weights: { ...this.weights },
      biases: { ...this.biases },
      neuronValues: JSON.parse(JSON.stringify(this.neuronValues)),
      gradients: JSON.parse(JSON.stringify(this.gradients)),
      step: this.step,
      subStep: this.subStep,
      activeElement: this.activeElement,
      mathDetails: this.mathDetails,
      symbolicMath: this.symbolicMath,
      numericMath: this.numericMath,
      epoch: this.epoch
    });

    if (this.step === 'idle') {
      this.step = 'forward';
      this.subStep = 0;
      this.forwardStep(0);
    } else if (this.step === 'forward') {
      if (this.subStep < 5) {
        this.subStep++;
        this.forwardStep(this.subStep);
      } else {
        const o0_val = this.neuronValues['o0'].val;
        const loss = Math.pow(this.target - o0_val, 2);
        this.neuronValues.o0.error = loss;
        
        ['h2_0', 'h2_1'].forEach(hId => {
          this.gradients.weights[`${hId}-o0`] = loss * this.neuronValues[hId].val;
        });
        this.gradients.biases['o0'] = loss;

        this.step = 'backward';
        this.subStep = 0;
        this.backwardStep(0);
      }
    } else if (this.step === 'backward') {
      if (this.subStep < 3) {
        this.subStep++;
        this.backwardStep(this.subStep);
      } else {
        this.step = 'update';
        this.subStep = 0;
        this.updateStep(0);
      }
    } else if (this.step === 'update') {
      if (this.subStep < 14) {
        this.subStep++;
        this.updateStep(this.subStep);
      } else {
        const loss = Math.pow(this.target - this.neuronValues['o0'].val, 2);
        const newHistoryItem = { epoch: this.epoch + 1, loss };
        this.history = [...this.history, newHistoryItem];
        if (this.history.length > 50) this.history.shift();
        
        this.epoch++;
        this.step = 'idle';
        this.mathDetails = "Epoch Complete! Weights updated.";
        this.activeElement = null;
      }
    }
  }

  handlePrevStep() {
    if (this.stepHistory.length === 0) return;
    const prevState = this.stepHistory.pop()!;
    this.weights = { ...prevState.weights };
    this.biases = { ...prevState.biases };
    this.neuronValues = JSON.parse(JSON.stringify(prevState.neuronValues));
    this.gradients = JSON.parse(JSON.stringify(prevState.gradients));
    this.step = prevState.step;
    this.subStep = prevState.subStep;
    this.activeElement = prevState.activeElement;
    this.mathDetails = prevState.mathDetails;
    this.symbolicMath = prevState.symbolicMath;
    this.numericMath = prevState.numericMath;
    this.epoch = prevState.epoch;
  }

  reset() {
    this.weights = { ...INITIAL_WEIGHTS };
    this.biases = { ...INITIAL_BIASES };
    this.neuronValues = {
      ...INITIAL_NEURON_VALUES,
      'i0': { val: this.x1, raw: this.x1, error: 0 },
      'i1': { val: this.x2, raw: this.x2, error: 0 },
    };
    this.history = [];
    this.epoch = 0;
    this.step = 'idle';
    this.subStep = 0;
    this.activeElement = null;
    this.mathDetails = null;
    this.symbolicMath = null;
    this.numericMath = null;
    this.stepHistory = [];
    this.isTraining = false;
  }
}

const NETWORK_KEY = Symbol('NETWORK');

export function setNetwork(network: NeuralNetwork) {
  setContext(NETWORK_KEY, network);
}

export function getNetwork() {
  return getContext<NeuralNetwork>(NETWORK_KEY);
}
