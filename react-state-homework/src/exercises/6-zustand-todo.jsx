import { useMemo, useState } from 'react';
import { create } from 'zustand';

const useTodoStore = create((set) => ({
  todos: [
    { id: 1, text: 'Learn useReducer', done: true },
    { id: 2, text: 'Learn Context API', done: true },
    { id: 3, text: 'Learn Zustand', done: false },
    { id: 4, text: 'Build project', done: false },
  ],
  filter: 'all',
  searchQuery: '',

  addTodo: (text) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, done: false }],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    })),

  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),

  setFilter: (filter) => set({ filter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));

function AddTodoForm() {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [text, setText] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    addTodo(trimmed);
    setText('');
  };

  return (
    <form className="row" onSubmit={onSubmit}>
      <input
        placeholder="Add task"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

function SearchInput() {
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const setSearchQuery = useTodoStore((state) => state.setSearchQuery);

  return (
    <input
      placeholder="Search tasks"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
  );
}

function FilterButtons() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);

  return (
    <div className="row">
      <button
        className={filter === 'all' ? 'active-filter' : ''}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        className={filter === 'active' ? 'active-filter' : ''}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        className={filter === 'completed' ? 'active-filter' : ''}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>
  );
}

function TodoList() {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const searchQuery = useTodoStore((state) => state.searchQuery);
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);

  const filteredTodos = useMemo(() => {
    let result = todos;

    if (filter === 'active') {
      result = result.filter((todo) => !todo.done);
    }

    if (filter === 'completed') {
      result = result.filter((todo) => todo.done);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((todo) => todo.text.toLowerCase().includes(query));
    }

    return result;
  }, [todos, filter, searchQuery]);

  if (!filteredTodos.length) {
    return <p>No tasks found</p>;
  }

  return (
    <ul className="list">
      {filteredTodos.map((todo) => (
        <li key={todo.id} className="todo-item">
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className={todo.done ? 'done-text' : ''}>{todo.text}</span>
          </label>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

function Stats() {
  const todos = useTodoStore((state) => state.todos);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((todo) => todo.done).length;
    const remaining = total - done;
    const percent = total ? Math.round((done / total) * 100) : 0;

    return { total, done, remaining, percent };
  }, [todos]);

  return (
    <div>
      <p>
        {stats.done} of {stats.total} done ({stats.percent}%)
      </p>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${stats.percent}%` }} />
      </div>
      <p>Remaining: {stats.remaining}</p>
    </div>
  );
}

export default function Exercise6ZustandTodo() {
  return (
    <div>
      <AddTodoForm />
      <SearchInput />
      <FilterButtons />
      <TodoList />
      <Stats />
    </div>
  );
}
