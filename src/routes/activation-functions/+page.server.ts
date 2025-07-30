
import { ActivationFunction, type SeriesData } from '$lib/types';
import { activate, derive, range } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {

  const inputRange = range(-3, 3, 0.01);

  let stepData: SeriesData[] = inputRange.map(
    (val): SeriesData =>
      <SeriesData>{
        input: val,
        activation: +activate(ActivationFunction.Step, val).toFixed(4),
        derivative: +derive(ActivationFunction.Step, val).toFixed(4)
      }
  );

  const smallInputRange = range(-3, 3, 0.1);

  let sigmoidData: SeriesData[] = smallInputRange.map(
    (val): SeriesData =>
      <SeriesData>{
        input: val,
        activation: +activate(ActivationFunction.Sigmoid, val).toFixed(4),
        derivative: +derive(ActivationFunction.Sigmoid, val).toFixed(4)
      }
  );

  let tanhData: SeriesData[] = smallInputRange.map(
    (val): SeriesData =>
      <SeriesData>{
        input: val,
        activation: +activate(ActivationFunction.Tanh, val).toFixed(4),
        derivative: +derive(ActivationFunction.Tanh, val).toFixed(4)
      }
  );

  let reluData: SeriesData[] = inputRange.map(
    (val): SeriesData =>
      <SeriesData>{
        input: val,
        activation: +activate(ActivationFunction.ReLU, val).toFixed(4),
        derivative: +derive(ActivationFunction.ReLU, val).toFixed(4)
      }
  );

  return {
    stepData, sigmoidData, tanhData, reluData
  };
};

