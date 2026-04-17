export const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const sigmoidDeriv = (z: number) => {
  const s = sigmoid(z);
  return s * (1 - s);
};

export const tanh = (x: number) => Math.tanh(x);

export const tanhDeriv = (z: number) => {
  const t = Math.tanh(z);
  return 1 - t * t;
};

export const relu = (x: number) => Math.max(0, x);

export const reluDeriv = (z: number) => (z > 0 ? 1 : 0);
