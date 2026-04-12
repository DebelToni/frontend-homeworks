const { createContext, useContext, useReducer, useState } = React;
const html = htm.bind(React.createElement);

const TaskContext = createContext(null);
const FilterContext = createContext(null);

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        nextId: state.nextId + 1,
        tasks: [
          ...state.tasks,
          {
            id: state.nextId,
            title: action.title,
            priority: action.priority,
            status: "todo",
            createdAt: new Date().toLocaleString("bg-BG"),
          },
        ],
      };
    case "MOVE_TASK": {
      const flow = { todo: "in-progress", "in-progress": "done" };
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id
            ? { ...task, status: flow[task.status] || task.status }
            : task,
        ),
      };
    }
    case "MOVE_TASK_BACK": {
      const flow = { done: "in-progress", "in-progress": "todo" };
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id
            ? { ...task, status: flow[task.status] || task.status }
            : task,
        ),
      };
    }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };
    default:
      return state;
  }
}

function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, {
    nextId: 4,
    tasks: [
      { id: 1, title: "Изграждане на layout", priority: "high", status: "todo", createdAt: "12.04.2026 г., 09:10:00 ч." },
      { id: 2, title: "API интеграция", priority: "medium", status: "in-progress", createdAt: "12.04.2026 г., 10:20:00 ч." },
      { id: 3, title: "Финален QA преглед", priority: "low", status: "done", createdAt: "12.04.2026 г., 11:30:00 ч." },
    ],
  });

  return html`<${TaskContext.Provider} value=${{ tasks: state.tasks, dispatch }}>${children}</${TaskContext.Provider}>`;
}

function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext трябва да е в TaskProvider");
  }
  return context;
}

function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    searchQuery: "",
    priorityFilter: "all",
  });

  const value = {
    ...filters,
    setSearch: (query) => setFilters((current) => ({ ...current, searchQuery: query })),
    setPriority: (priority) => setFilters((current) => ({ ...current, priorityFilter: priority })),
  };

  return html`<${FilterContext.Provider} value=${value}>${children}</${FilterContext.Provider}>`;
}

function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext трябва да е в FilterProvider");
  }
  return context;
}

function TaskForm() {
  const { dispatch } = useTaskContext();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_TASK", title: trimmed, priority });
    setTitle("");
    setPriority("medium");
  }

  return html`
    <section className="panel">
      <span className="panel-title">Нова задача</span>
      <form className="task-form" onSubmit=${handleSubmit}>
        <input value=${title} onChange=${(event) => setTitle(event.target.value)} placeholder="Заглавие на задачата" />
        <select value=${priority} onChange=${(event) => setPriority(event.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button className="primary-btn" type="submit">Добави</button>
      </form>
    </section>
  `;
}

function FilterBar() {
  const { searchQuery, priorityFilter, setSearch, setPriority } = useFilterContext();

  return html`
    <section className="panel">
      <span className="panel-title">Филтри</span>
      <div className="filter-row">
        <input value=${searchQuery} onChange=${(event) => setSearch(event.target.value)} placeholder="Търсене по заглавие" />
        <select value=${priorityFilter} onChange=${(event) => setPriority(event.target.value)}>
          <option value="all">Всички приоритети</option>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </div>
    </section>
  `;
}

function TaskCard({ task }) {
  const { dispatch } = useTaskContext();
  const canMoveForward = task.status !== "done";
  const canMoveBack = task.status !== "todo";

  return html`
    <article className="task-card">
      <h3>${task.title}</h3>
      <div className="task-meta">
        <span className=${`badge ${task.priority}`}>${task.priority}</span>
        <span>${task.createdAt}</span>
      </div>
      <div className="task-actions">
        ${canMoveBack && html`<button className="secondary-btn" type="button" onClick=${() => dispatch({ type: "MOVE_TASK_BACK", id: task.id })}>${"<"} Назад</button>`}
        ${canMoveForward && html`<button className="secondary-btn" type="button" onClick=${() => dispatch({ type: "MOVE_TASK", id: task.id })}>Напред ${">"}</button>`}
        <button className="danger-btn" type="button" onClick=${() => dispatch({ type: "DELETE_TASK", id: task.id })}>Изтрий</button>
      </div>
    </article>
  `;
}

function KanbanColumn({ status, label }) {
  const { tasks } = useTaskContext();
  const { searchQuery, priorityFilter } = useFilterContext();

  const filtered = tasks
    .filter((task) => task.status === status)
    .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((task) => priorityFilter === "all" || task.priority === priorityFilter);

  return html`
    <section className="column">
      <h2>${label} (${filtered.length})</h2>
      <div className="column-body">
        ${filtered.length > 0
          ? filtered.map((task) => html`<${TaskCard} key=${task.id} task=${task} />`)
          : html`<div className="empty-column">Няма задачи</div>`}
      </div>
    </section>
  `;
}

function Dashboard() {
  const { tasks } = useTaskContext();
  const todo = tasks.filter((task) => task.status === "todo").length;
  const inProgress = tasks.filter((task) => task.status === "in-progress").length;
  const done = tasks.filter((task) => task.status === "done").length;
  const highPriority = tasks.filter((task) => task.priority === "high").length;
  const completedPercent = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  return html`
    <section className="dashboard">
      <div className="metric"><span>За правене</span><strong>${todo}</strong></div>
      <div className="metric"><span>В прогрес</span><strong>${inProgress}</strong></div>
      <div className="metric"><span>Готово</span><strong>${done}</strong></div>
      <div className="metric"><span>High priority / Завършени</span><strong>${highPriority} / ${completedPercent}%</strong></div>
    </section>
  `;
}

function AppLayout() {
  return html`
    <main className="kanban-shell">
      <section className="hero">
        <p className="eyebrow">Задача 5</p>
        <h1>Kanban Board с Context и useReducer</h1>
        <p>Глобален state за задачите и отделен контекст за филтрите.</p>
      </section>
      <${Dashboard} />
      <div className="top-grid">
        <${TaskForm} />
        <${FilterBar} />
      </div>
      <section className="columns-grid">
        <${KanbanColumn} status="todo" label="За правене" />
        <${KanbanColumn} status="in-progress" label="В прогрес" />
        <${KanbanColumn} status="done" label="Готово" />
      </section>
    </main>
  `;
}

function App() {
  return html`
    <${TaskProvider}>
      <${FilterProvider}>
        <${AppLayout} />
      </${FilterProvider}>
    </${TaskProvider}>
  `;
}

ReactDOM.createRoot(document.querySelector("#app")).render(html`<${App} />`);
