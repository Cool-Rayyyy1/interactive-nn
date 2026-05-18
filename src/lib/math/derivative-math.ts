import { derivative, parse, evaluate } from 'mathjs';

export interface Point {
  x: number;
  y: number;
}

export const evaluateFunction = (expr: string, x: number): number => {
  try {
    return evaluate(expr, { x });
  } catch (e) {
    return NaN;
  }
};

export const getDerivativeExpr = (expr: string): string => {
  try {
    return derivative(expr, 'x').toString();
  } catch (e) {
    return '';
  }
};

export const getTangentLine = (expr: string, x0: number): { m: number, b: number } => {
  try {
    const y0 = evaluateFunction(expr, x0);
    const dExpr = getDerivativeExpr(expr);
    const m = evaluateFunction(dExpr, x0);
    // y - y0 = m(x - x0) => y = mx - mx0 + y0 => y = mx + (y0 - m*x0)
    const b = y0 - (m * x0);
    return { m, b };
  } catch (e) {
    return { m: 0, b: 0 };
  }
};

export const findLocalMinima = (expr: string, minX: number, maxX: number): Point[] => {
  const samples = 200;
  const step = (maxX - minX) / samples;
  const minima: Point[] = [];
  
  let prevX = minX;
  let prevY = evaluateFunction(expr, minX);
  let prevSlope = (evaluateFunction(expr, minX + 0.0001) - prevY) / 0.0001;

  for (let i = 1; i <= samples; i++) {
    const x = minX + i * step;
    const y = evaluateFunction(expr, x);
    const slope = (evaluateFunction(expr, x + 0.0001) - y) / 0.0001;
    
    // Local minimum: slope goes from negative to positive
    if (prevSlope < 0 && slope > 0) {
      minima.push({ x, y });
    }
    
    prevX = x;
    prevY = y;
    prevSlope = slope;
  }
  
  return minima;
};
