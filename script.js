// Variables

let inputEquation = [];
let inputNum = '';
let tempEquation = [];

const input = document.getElementById('input');
const output = document.getElementById('output');
const clearButton = document.getElementById('allclear');
const inverse = document.getElementById('inverse');
const decimal = document.getElementById('decimal');
const backspace = document.getElementById('backspace');
const equals = document.getElementById('equals');

const allButtons = Array.from(document.querySelectorAll('button'));
const allButtonsExceptClear = allButtons.filter(button => button.allclear)
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const operatorArray = operatorButtons.map(operator => operator.dataset['key']);
const operatorMathArray = ['%', '*', '/', '+', '-']

// Event Listeners

numberButtons.forEach((button) =>
  button.onclick = () => attachNumber(button.innerHTML)
);

operatorButtons.forEach((button) => 
  button.onclick = () => attachOperator(button.dataset['key'])
);

// window.onkeydown = () => keyboardInput();
window.onkeydown = (e) => keyboardInput(e);
clearButton.onclick = () => clear();
inverse.onclick = () => invertSign();
decimal.onclick = () => attachDecimal();
backspace.onclick = () => deleteLastInput();
equals.onclick = () => updateEquals();

// Event Listener Functions

// attaches a number to the input display
function attachNumber(number) {
  const lastElement = inputEquation[inputEquation.length - 1];

  if (inputNum > 1 || !operatorArray.includes(lastElement)){
    inputNum += number;
    inputEquation.splice(-1, 1, inputNum);
  } else if (inputNum === '') {
    inputNum += number;
    inputEquation.push(inputNum); 
  }
  input.innerHTML = inputEquation.join('');
  output.innerHTML = evaluate(inputEquation);
  checkInputLength();
};

// checks to see if input display is greater than 9 digits
function checkInputLength() {
  const inputTotal = input.innerHTML;
  length = inputTotal.length;
  if (length > 22) {
    input.innerHTML = Number(inputNum).toExponential(2);
    output.innerHTML = Number(inputNum).toExponential(2);
  }
}

// if there is no current operator, adds an operator to the input equation
// otherwise, evaluates current input equation in the output display
function attachOperator(operator) {
  const lastElement = inputEquation[inputEquation.length - 1];
  if (operatorArray.includes(lastElement)) { // if operator exists - replace operator
    inputEquation.splice(-1, 1, operator);
    input.innerHTML = inputEquation.join('');
    return;
  }
  if (inputEquation.length === 0 || lastElement === '0.') { // if operator does not exist - add 0 and operator
    inputEquation.pop();
    input.innerHTML = `0${operator}`;
    inputEquation.push('0');
    inputEquation.push(operator);
    inputNum = '';
    output.innerHTML = evaluate(inputEquation);
  } else { // if number exists and operator does not exist - add operator
    input.innerHTML += operator;
    inputEquation.push(operator);
    inputNum = '';
  }
  input.innerHTML = inputEquation.join('');
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
  if (inputNum === '' || inputNum === '0.') return;
  inputNum = (inputNum * -1).toString();
  inputEquation.splice(-1, 1, inputNum);
  updateOutput();
};

// attach decimal point if there is none in the output
function attachDecimal() {
  const lastElement = inputEquation[inputEquation.length - 1];
  if (operatorArray.includes(lastElement)) { // if operator is last element in equation
    inputNum = '0.';
    inputEquation.push(inputNum);
    inputEquation.splice(-1, 1, inputNum);
  } else if (inputNum.length > 0 && !inputNum.includes('.')) { // if number does not have decimal
    inputNum += '.'
    inputEquation.splice(-1, 1, inputNum);
  } else if (inputNum.length === 0) { // if number is empty
    inputNum = '0.'
    inputEquation.splice(-1, 1, inputNum);
  }
  updateOutput();
}

function updateOutput() {
  // if equation is just 1 number - input and output become number
  if (inputEquation.length <= 1) {
    input.innerHTML = inputNum;
    output.innerHTML = inputNum;
  } else { // if equation is more than 1 number - input becomes evaluate() output
    inputEquation = inputEquation.filter(el => el);
    input.innerHTML = inputEquation.join('');
    
    output.innerHTML = evaluate(inputEquation);
  }
}

// evaluates the current input
function evaluate(equation) {
  let calc = equation.filter(el => el)
                     .slice(0);
  if (calc.length < 3) {
    return Number(calc[0]);
  }
  const lastElement = calc[calc.length - 1];
  if (operatorArray.includes(lastElement)) {
    calc = calc.slice(-1, 1);
  }
  
  // loops until first part of PEMDAS is complete
  while (calc.includes("x") || calc.includes("÷") || calc.includes("%")) {
    const operator = calc.find(el => el === "x" || el === "÷" || el === "%");
    const operatorIdx = calc.indexOf(operator);
    const num1 = calc[operatorIdx - 1];
    const num2 = calc[operatorIdx + 1];
    const total = operate(operator, num1, num2);

    calc.splice(operatorIdx - 1, 3, total);
  }

  // loops until second part of PEMDAS is complete
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
  if (e.key === 'Escape') clear();
  if (e.key === '.') attachDecimal();
  if (e.key === '=' || e.key === 'Enter') updateEquals();
  if (e.key === 'Backspace') deleteLastInput();
}

function deleteLastInput() {
  if (tempEquation.length >= 1) {
    inputEquation = tempEquation;
  }

  inputEquation = inputEquation.filter(el => el)
                               .slice(0);
  if (inputEquation.length === 0) return;
  let lastElement = inputEquation[inputEquation.length - 1];
  if (lastElement === '%') {
    inputEquation.splice(-1, 1);
    inputNum = inputEquation[inputEquation.length - 1];
    updateOutput();
    tempEquation = [];
    return;
  }
  lastElement = lastElement.slice(0, -1);
  inputEquation.splice(-1, 1, lastElement);
  inputNum = lastElement;
  updateOutput();
  tempEquation = [];
}

function updateEquals() {
  if (output.innerHTML === '') return;
  tempEquation = inputEquation.slice(0);
  if (inputEquation.length < 3) {
    input.innerHTML = evaluate(inputEquation);
    output.innerHTML = evaluate(inputEquation);
    inputEquation = [`${evaluate(inputEquation)}`];
    inputNum = '';
    return;
  }
  input.innerHTML = output.innerHTML;
  inputNum = '';
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
    case '%': return a % b;
    case '+': return a + b;
    case '-': return a - b;
    case 'x': return a * b;
    case '÷': return a / b;
  };
};

function convertOperator(operator) {
  if (operator == '%') return '%';
  if (operator == '+') return '+';
  if (operator == '-') return '-';
  if (operator == '*') return 'x';
  if (operator == '/') return '÷';
}