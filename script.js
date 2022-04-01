// Variables

let firstNum = '';
let secondNum = '';
let currentOperator = null;
let resetDisplay = false;

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

// Event Listeners

numberButtons.forEach((button) =>
  button.addEventListener('click', () => attachNumber(button.innerHTML))
);

operatorButtons.forEach((button) =>
  button.addEventListener('click', () => attachOperator(button.innerHTML))
);

clearButton.addEventListener('click', clear);
inverse.addEventListener('click', invertSign);
decimal.addEventListener('click', attachDecimal);
equals.addEventListener('click', evaluate);

// Event Listener Functions

function attachNumber(number) {
  if (output.innerHTML === '0' || resetDisplay === true) {
    resetOutput();
  }
  output.innerHTML += number;
  checkOutputLength()
};

function checkOutputLength() {
  outputTotal = output.innerHTML;
  length = outputTotal.length;
  if (length > 9) {
    output.innerHTML = outputTotal.substring(0, 9);
  }
}

function attachOperator(operator) {
  if (currentOperator !== null) evaluate();
  firstNum = output.innerHTML;
  currentOperator = operator;
  input.innerHTML = `${firstNum} ${currentOperator}`
  resetDisplay = true;
};

function clear() {
  input.innerHTML = ''
  output.innerHTML = '0'
  firstNum = ''
  secondNum = ''
  currentOperator = null
};

function invertSign() {
  output.innerHTML *= -1;
}

function attachDecimal() {
  if (!output.innerHTML.includes('.')) {
    output.innerHTML += '.'
  }
}

// Helper Functions

// evaluates the current input and output with the current operator
function evaluate() {
  if (firstNum === '') return;
  secondNum = output.innerHTML;
  const returnVal = operate(currentOperator, firstNum, secondNum);
  output.innerHTML = roundNum(returnVal);
};

function roundNum(num) {
  return Math.round((num + Number.EPSILON) * 100000) / 100000;
}

function resetInput() {
  input.innerHTML = '';
};

function resetOutput() {
  output.innerHTML = '';
  resetDisplay = false;
};

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