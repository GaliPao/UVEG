const screenOp = document.getElementById("screenOp");
const screenResult = document.getElementById("screenResult");

let current = "0";     // número que se está escribiendo
let previous = null;   // número anterior
let operator = null;   // + - * /
let justCalculated = false;

function updateScreen() {
  const opText = previous !== null && operator
    ? `${previous} ${symbol(operator)} ${justCalculated ? "" : ""}`
    : (operator ? `${previous ?? ""} ${symbol(operator)}`.trim() : "0");

  screenOp.textContent = (previous === null && operator === null) ? "0" : opText;
  screenResult.textContent = current;
}

function symbol(op){
  if(op === "*") return "×";
  if(op === "/") return "÷";
  if(op === "-") return "−";
  return "+";
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justCalculated = false;
  updateScreen();
}

function appendNumber(n) {
  if (justCalculated) {
    current = "0";
    justCalculated = false;
  }

  if (current === "0") current = n;
  else current += n;

  updateScreen();
}

function addDot() {
  if (justCalculated) {
    current = "0";
    justCalculated = false;
  }
  if (!current.includes(".")) {
    current += ".";
  }
  updateScreen();
}

function setOperator(op) {
  if (operator && previous !== null && !justCalculated) {
    calculate();
  }

  previous = current;
  operator = op;
  justCalculated = false;
  current = "0";
  updateScreen();
}

function calculate() {
  if (operator === null || previous === null) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);

  let result = 0;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/":
      if (b === 0) {
        current = "Error";
        previous = null;
        operator = null;
        justCalculated = true;
        updateScreen();
        return;
      }
      result = a / b;
      break;
  }

  // evitar muchos decimales
  const rounded = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

  current = String(rounded);
  previous = null;
  operator = null;
  justCalculated = true;
  updateScreen();
}

// Manejo de clicks
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const num = btn.dataset.num;
  const op = btn.dataset.op;
  const action = btn.dataset.action;

  if (num !== undefined) appendNumber(num);
  else if (op) setOperator(op);
  else if (action === "equals") calculate();
  else if (action === "clear") clearAll();
  else if (action === "dot") addDot();
});

updateScreen();
