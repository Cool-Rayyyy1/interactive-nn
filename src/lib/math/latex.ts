const step: string = `f(x) = 
\\left \\{
\\begin{aligned}
  -1     &\\qquad \\text{if } x < 0   \\\\
  0      &\\qquad \\text{if } x = 0   \\\\
  1      &\\qquad \\text{if } x > 0
\\end{aligned} \\right.`;

const sigmoid: string = `f(x) = \\frac{1}{1 + e^{-x}}`;

const tanh: string = `f(x) = \\frac{e^x - e^{-x}}{e^x + e^{-x}}`;

const relu: string = `f(x) = \\text{max}(0, x) = 
\\left \\{
\\begin{aligned}
  x     &\\qquad \\text{if } x > 0   \\\\
  0      &\\qquad \\text{if } x \\leq 0   \\\\
\\end{aligned} \\right. `;

const basicPolynomial: string = `x^3 + x^2 + x + 1`;

const basicPolynomialCoefficients: string = `2x^3 - 2x^2 + 7x + 8`;

const generalPolynomial: string = `f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3`;

const fiveTermPolynomial: string = `f(x) = k_0 + k_1 x + k_2 x^2 + k_3 x^3 + k_4 x^4 + k_5 x^5`;

const mse: string = `\\text{Mean Squared Error (MSE)} = \\frac{\\sum_{i=1}^{n}{f(x_i)}}{n}`;

const stepSize: string = `\\text{Learning Rate} = \\eta
\\text{Step Size} = f'(x) \\times \\eta`;

const dx_step: string = `
f^{\\prime}(x) = 0
`;

const dx_sigmoid: string = `
f^{\\prime}(x) = \\frac{1}{1 + e^{-x}} \\times \\left( 1 - \\frac{1}{1 + e^{-x}}) \\right)
`;

const dx_tanh: string = `
f^{\\prime}(x) = 1 - \\left( \\frac{e^x - e^{-x}}{e^x + e^{-x}} \\right)^2 = 1 - \\text{tanh}(x)^2
`;

const dx_relu: string = `
f^{\\prime}(x) =  
\\left \\{
\\begin{aligned}
  1     &\\qquad \\text{if } x \\geq 0   \\\\
  0      &\\qquad \\text{if } x < 0   \\\\
\\end{aligned} \\right. 
`;

export { step, sigmoid, tanh, relu, basicPolynomial, basicPolynomialCoefficients, generalPolynomial, fiveTermPolynomial, mse, stepSize, dx_step, dx_sigmoid, dx_tanh, dx_relu }
