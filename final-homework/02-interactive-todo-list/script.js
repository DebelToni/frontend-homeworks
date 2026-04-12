const STORAGE_KEY = "task-02-todos";

function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();
let filter = "all";

const input = document.querySelector("#todo-input");
const addButton = document.querySelector("#add-btn");
const list = document.querySelector("#todo-list");
const error = document.querySelector("#error");
const counter = document.querySelector("#counter");
const filterButtons = document.querySelectorAll(".filter-btn");

function createTodoItem(todo) {
  const item = document.createElement("li");
  item.className = todo.completed ? "todo-item completed" : "todo-item";
  item.dataset.id = String(todo.id);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.className = "todo-toggle";

  const text = document.createElement("span");
  text.className = "todo-text";
  text.textContent = todo.text;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "delete-btn";
  remove.textContent = "X";

  item.append(checkbox, text, remove);
  return item;
}

function renderTodos() {
  list.innerHTML = "";

  const filtered = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "Няма задачи за този филтър.";
    list.appendChild(empty);
  } else {
    filtered.forEach((todo) => {
      list.appendChild(createTodoItem(todo));
    });
  }

  const done = todos.filter((todo) => todo.completed).length;
  counter.textContent = `${done} от ${todos.length} задачи завършени`;
}

function setError(message) {
  error.textContent = message;
}

function addTodo() {
  const text = input.value.trim();

  if (!text) {
    setError("Въведете задача!");
    return;
  }

  todos.push({ id: Date.now(), text, completed: false });
  saveTodos(todos);
  input.value = "";
  setError("");
  renderTodos();
}

addButton.addEventListener("click", addTodo);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) return;

  const id = Number(item.dataset.id);

  if (event.target.classList.contains("todo-toggle")) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    saveTodos(todos);
    renderTodos();
  }

  if (event.target.classList.contains("delete-btn")) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos(todos);
    renderTodos();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTodos();
  });
});

renderTodos();
