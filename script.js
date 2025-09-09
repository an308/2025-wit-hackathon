// --- Input + Output ---
function showMessage() {
  let input = document.getElementById("userInput").value;
  let output = document.getElementById("output");
  
  if (input.trim() === "") {
    output.textContent = "⚠️ Please type something!";
  } else {
    output.textContent = "✅ You entered: " + input;
  }
}

// --- Click Counter ---
let count = 0;
function increment() {
  count++;
  document.getElementById("count").textContent = count;
}

// --- To-Do List ---
function addTask() {
  let input = document.getElementById("todoInput");
  let taskText = input.value.trim();
  if (taskText === "") return;

  let li = document.createElement("li");
  li.textContent = taskText;
  li.classList.add("list-group-item");

  // Remove task on click
  li.onclick = function() {
    this.remove();
  };

  document.getElementById("todoList").appendChild(li);
  input.value = "";
}

// --- Calculator ---
function calculate(op) {
  let n1 = parseFloat(document.getElementById("num1").value);
  let n2 = parseFloat(document.getElementById("num2").value);
  let result;

  if (isNaN(n1) || isNaN(n2)) {
    result = "⚠️ Enter numbers first!";
  } else {
    if (op === '+') result = n1 + n2;
    if (op === '-') result = n1 - n2;
    if (op === '*') result = n1 * n2;
    if (op === '/') result = n2 !== 0 ? n1 / n2 : "❌ Divide by 0!";
  }

  document.getElementById("calcResult").textContent = "Result: " + result;
}

// --- Random Number Generator ---
function generateRandom() {
  let num = Math.floor(Math.random() * 100) + 1; // 1–100
  document.getElementById("randomOutput").textContent = "🎲 " + num;
}

// --- Dark Mode ---
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}