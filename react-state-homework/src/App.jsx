import './App.css';
import Exercise1Counter from './exercises/1-counter';
import Exercise2ThemeContext from './exercises/2-theme-context';
import Exercise3Notifications from './exercises/3-notifications';
import Exercise4ShoppingCart from './exercises/4-shopping-cart';
import Exercise5MultiContextDashboard from './exercises/5-multi-context-dashboard';
import Exercise6ZustandTodo from './exercises/6-zustand-todo';
import Exercise7MiniEcommerce from './exercises/7-mini-ecommerce';

function App() {
  return (
    <main className="page">
      <h1>React state exercises</h1>
      <p>Simple implementations for all tasks from the lesson.</p>

      <section className="exercise">
        <h2>1. Counter with useReducer</h2>
        <Exercise1Counter />
      </section>

      <section className="exercise">
        <h2>2. Theme toggle with Context API</h2>
        <Exercise2ThemeContext />
      </section>

      <section className="exercise">
        <h2>3. Notifications with Context + useReducer</h2>
        <Exercise3Notifications />
      </section>

      <section className="exercise">
        <h2>4. Shopping cart with useReducer</h2>
        <Exercise4ShoppingCart />
      </section>

      <section className="exercise">
        <h2>5. Multi-context dashboard</h2>
        <Exercise5MultiContextDashboard />
      </section>

      <section className="exercise">
        <h2>6. Todo app with Zustand</h2>
        <Exercise6ZustandTodo />
      </section>

      <section className="exercise">
        <h2>7. Mini e-commerce app</h2>
        <Exercise7MiniEcommerce />
      </section>
    </main>
  );
}

export default App;
