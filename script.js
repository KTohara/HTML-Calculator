// Variables

let inputEquation = [];
let inputNum = '';
let firstNum = '';
let secondNum = '';
let currentOperator = null;
let lastOperator = '';

const input = document.getElementById('input');
const output = document.getElementById('output');
const clearButton = document.getElementById('allclear');
const inverse = document.getElementById('inverse');
const decimal = document.getElementById('decimal');
const backspace = document.getElementById('backspace');
const equals = document.getElementById('equals');

const numberButtons = document.querySelectorAll('.number');
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const operatorArray = operatorButtons.map(operator => operator.innerHTML);
const operatorMathArray = ['*', '/', '+', '-']

// Event Listeners

numberButtons.forEach((button) =>
  button.onclick = () => attachNumber(button.innerHTML)
);

operatorButtons.forEach((button) => 
  button.onclick = () => attachOperator(button.innerHTML)
);

// window.onkeydown = () => keyboardInput();
window.onkeydown = (e) => keyboardInput(e);
clearButton.onclick = () => clear();
inverse.onclick = () => invertSign();
decimal.onclick = () => attachDecimal();
equals.onclick = () => updateEquals();

// Event Listener Functions

// attaches a number to the input display
function attachNumber(number) {
  if (inputNum === '' || operatorArray.includes(lastOperator)) {
   inputNum += number;
   inputEquation.push(inputNum); 
  } else {
    inputNum += number;
    inputEquation.splice(-1, 1, inputNum);
  }
  input.innerHTML = inputEquation.join(' ');
  if (inputEquation.length <= 1) {
    output.innerHTML = inputEquation.join(' ');
  } else {
    output.innerHTML = evaluate(inputEquation);
  }
  checkInputLength();
};

// checks to see if input display is greater than 9 digits
function checkInputLength() {
  const inputTotal = input.innerHTML;
  length = inputTotal.length;
  if (length > 22) {
    input.innerHTML = inputTotal.slice(0, 22);
    output.innerHTML = inputTotal.slice(0, 22);
  }
}

// if there is no current operator, adds an operator to the input equation
// otherwise, evaluates current input equation in the output display
function attachOperator(operator) {
  const lastElement = inputEquation[inputEquation.length - 1]; // not correct - needs actual operator
  if (operatorArray.includes(lastElement)) {
    inputEquation.splice(-1, 1, operator);
    input.innerHTML = inputEquation.join(' ');
    return;
  }
  if (inputNum.length === 0) {
    input.innerHTML = `0${operator}`;
    inputEquation.push(0);
    inputEquation.push(operator);
    inputNum = "";
  } else {
    input.innerHTML += operator;
    inputEquation.push(operator);
    inputNum = "";
  }
  input.innerHTML = inputEquation.join(' ');
  checkInputLength();
};

// clears the output and input display
function clear() {
  input.innerHTML = '';
  output.innerHTML = '';
  inputEquation = [];
  inputNum = '';
};

// inverts the input into negative or positive, evaluates input
function invertSign() {
  if (inputNum === '') return;
  inputNum = (inputNum * -1).toString();
  updateOutput();
};

// attach decimal point if there is none in the output
function attachDecimal() {
  if (inputNum.length === 0) {
    inputNum = '0.'
  } else if (inputNum.length > 0 && !inputNum.includes('.')) {
    inputNum += '.'
  };
  updateOutput();
}

function updateOutput() {
  if (inputEquation.length <= 1) {
    input.innerHTML = inputNum;
    output.innerHTML = inputNum;
  } else {
    inputEquation.splice(-1, 1, inputNum);
    input.innerHTML = inputEquation.join(' ');
    output.innerHTML = evaluate(inputEquation);
  }
}

// evaluates the current input
function evaluate(equation) {
  if (equation.length < 3) return;
  let calc = equation.slice(0);
  while (calc.includes("x") || calc.includes("÷") || calc.includes("MOD")) {
    const operator = calc.find(el => el === "x" || el === "÷" || el === "MOD");
    const operatorIdx = calc.indexOf(operator);
    const num1 = calc[operatorIdx - 1];
    const num2 = calc[operatorIdx + 1];
    const total = operate(operator, num1, num2);

    calc.splice(operatorIdx - 1, 3, total);
  }

  while (calc.includes("+") || calc.includes("-")) {
    const operator = calc.find(el => el === "+" || el === "-");
    const operatorIdx = calc.indexOf(operator);
    const num1 = calc[operatorIdx - 1];
    const num2 = calc[operatorIdx + 1];
    const total = operate(operator, num1, num2);

    calc.splice(operatorIdx - 1, 3, total);
  }
  return Number(calc);
}

// Keyboard Support
function keyboardInput(e) {
  e.preventDefault();
  if (e.key >= 0 && e.key <= 9) attachNumber(e.key);
  if (operatorMathArray.includes(e.key)) attachOperator(convertOperator(e.key));
  if (e.key == 'Escape') clear();
  if (e.key == '.') attachDecimal();
  if (e.key == '=' || e.key == 'Enter') updateEquals();
}

function updateEquals() {
  if (output.innerHTML === '') return;
  input.innerHTML = output.innerHTML;
  inputNum = output.innerHTML;
  output.innerHTML = null;
  inputEquation = [input.innerHTML];
}

// Helper Functions

function roundNum(num) {
  return Math.round((num + Number.EPSILON) * 100000) / 100000;
}

const operate = (operator, a, b) => {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case 'MOD': return a % b;
    case '+': return a + b;
    case '-': return a - b;
    case 'x': return a * b;
    case '÷': return a / b;
  };
};

function convertOperator(operator) {
  if (operator == 'MOD') return 'MOD';
  if (operator == '+') return '+';
  if (operator == '-') return '-';
  if (operator == '*') return 'x';
  if (operator == '/') return '÷';
}