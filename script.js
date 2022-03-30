let firstNum = ''
let secondNum = ''
let currentOperator = ''

const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

const multiply = (a, b) => {
  return a * b;
};

const divide = (a, b) => {
  return a / b;
};

const operate = (operator, a, b) => {
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case 'x': return multiply(a, b);
    case '÷': return divide(a, b);
  };
};
const input = document.getElementById('input');
const output = document.getElementById('output');
const clearButton = document.getElementById('allclear');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = Array.from(document.querySelectorAll('.operator'));
const operatorArray = operatorButtons.map(operator => operator.innerHTML);

clearButton.addEventListener('click', clear)

numberButtons.forEach((button) =>
  button.addEventListener('click', () => attachNumber(button.innerText))
)

operatorButtons.forEach((button) =>
  button.addEventListener('click', () => attachOperator(button.innerText))
)

function attachNumber(number) {
  if (output.innerText === '0') {
    resetOutput();
  }
  output.innerText += number
}

function attachOperator(operator) {
  currentOperator = operator;
  if (operatorArray.includes(currentOperator)) evaluate();
  firstNum = output.innerText;
  input.innerText = `${firstNum} ${currentOperator}`
}

function clear() {
  input.innerHTML = ''
  output.innerHTML = '0'
  firstNum = ''
  secondNum = ''
}

function evaluate() {
  secondNum = output.innerHTML;
  output.innerHTML = operate(currentOperator, firstNum, secondNum);
  resetInput()
}

function resetInput() {
  input.innerHTML = ''
}

function resetOutput() {
  output.innerText = ''
}