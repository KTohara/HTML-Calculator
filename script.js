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
    case 'add': return add(a, b);
    case 'subtract': return subtract(a, b);
    case 'multiply': return multiply(a, b);
    case 'divide': return divide(a, b);
  };
};
const input = document.getElementById('input');
const output = document.getElementById('output');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');

numberButtons.forEach((button) =>
  button.addEventListener('click', () => attachNumber(button.innerText))
)

operatorButtons.forEach((button) =>
  button.addEventListener('click', () => attachOperator(button.innerText))
)

function attachNumber(number) {
  if (output.innerText === '0') {
    resetScreen();
  }
  output.innerText += number
}

function attachOperator(operator) {
  
}

function resetScreen() {
  output.innerText = ''
}