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

function attachNumber(number) {
  /*
    attaches a number to the input display
      if input number is 0 - replace number
      if input number is greater than 1 or last element in equation is a number - concat number, replace with existing number in equation
      else add a new number into the equation
      update output
      check input length
  */
  const lastElement = inputEquation[inputEquation.length - 1];
  if (inputNum === '0' || !operatorArray.includes(lastElement)) {
    inputNum = number;
    inputEquation.splice(-1, 1, inputNum);
  } else if (inputNum > 1) {
    inputNum += number;
    inputEquation.splice(-1, 1, inputNum);
  } else if (inputNum === '') {
    inputNum += number;
    inputEquation.push(inputNum); 
  }
  updateDisplay();
  checkInputLength();
};

function attachOperator(operator) {
  /*
    attach operator and evaluate input equation into output:
      if operator is last element - replace operator in equation
      if equation is empty or last element is 0 - add 0 and operator to equation
      if number exists, but not operator - add operator to equation
    update input
    check input length
  */
  const lastElement = inputEquation[inputEquation.length - 1];
  if (operatorArray.includes(lastElement)) {
    inputEquation.splice(-1, 1, operator);
    input.innerHTML = inputEquation.join('');
    return;
  }
  if (inputEquation.length === 0 || lastElement === '0.') {
    inputEquation.pop();
    input.innerHTML = `0${operator}`;
    inputEquation.push('0');
    inputEquation.push(operator);
    inputNum = '';
    output.innerHTML = evaluate(inputEquation);
  } else {
    input.innerHTML += operator;
    inputEquation.push(operator);
    inputNum = '';
  }
  input.innerHTML = inputEquation.join('');
  checkInputLength();
};

function checkInputLength() {
  // if input display is greater than 21 digits - convert to exponent
  const inputTotal = input.innerHTML;
  length = inputTotal.length;
  if (length > 21) {
    input.innerHTML = Number(inputNum).toExponential(2);
    output.innerHTML = Number(inputNum).toExponential(2);
  }
}

function clear() {
  // clears the output and input display
  input.innerHTML = '';
  output.innerHTML = '';
  inputEquation = [];
  inputNum = '';
};

function invertSign() {
  /*
    if there is no last number, or is a 0 (with or without decimal) - return
    invert number, and replace into equation
    update output
  */
  if (inputNum === '' || inputNum === '0.') return;
  inputNum = (inputNum * -1).toString();
  inputEquation.splice(-1, 1, inputNum);
  updateDisplay();
};

// attach decimal point if there is none in the output
function attachDecimal() {
  /*
    if last element of equation is an operator - attach decimal as '0.'
    if the last number does not have a decimal - attach decimal to number
    if there is no last number - attach decimal as '0.'
  */
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
  updateDisplay();
}

function updateDisplay() {
  /*
    if equation is only 1 number; input and output become the number
    else the input is updated, and output is calculated using evaluate()
  */
  if (inputEquation.length <= 1) {
    input.innerHTML = inputNum;
    output.innerHTML = inputNum;
  } else {
    inputEquation = inputEquation.filter(el => el);
    input.innerHTML = inputEquation.join('');
    output.innerHTML = evaluate(inputEquation);
  }
}

// evaluates the current input
function evaluate(equation) {
  /*
    filters any empty space if any
    if equation length is incomplete and less than 3, return the first number
    if equation ends with an operator, remove operator
    loops calculation to PEMDAS rule
    returns final number
  */
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
  /*
    checks to see if equals/enter was pressed
      - if yes, uses old equation for deletion
    if equation is empty, return
    deletes last entry depending on number or operator
    updates output
  */
  if (tempEquation.length >= 1) {
    inputEquation = tempEquation;
  }
  inputEquation = inputEquation.filter(el => el)
                               .slice(0);
  if (inputEquation.length === 0) return;
  let lastElement = inputEquation[inputEquation.length - 1];
  lastElement = lastElement.slice(0, -1);
  inputEquation.splice(-1, 1, lastElement);
  inputNum = lastElement;
  updateDisplay();
  tempEquation = [];
}

function updateEquals() {
  /*
    when enter or equals is pressed:
      if the output is empty - return
    sets temp equation
      if the input equation is incomplete - update input, output, equation, number, and return
    updates input, output, number, equation 
  */
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
  output.innerHTML = null;
  inputNum = '';
  inputEquation = [input.innerHTML];
}

// Helper Functions

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