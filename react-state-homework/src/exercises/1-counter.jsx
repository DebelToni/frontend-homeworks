import { useReducer, useState } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT': {
      const nextCount = state.count + 1;
      return {
        count: nextCount,
        history: [...state.history, `+1 -> ${nextCount}`],
      };
    }
    case 'DECREMENT': {
      const nextCount = state.count - 1;
      return {
        count: nextCount,
        history: [...state.history, `-1 -> ${nextCount}`],
      };
    }
    case 'INCREMENT_BY': {
      const amount = Number(action.payload) || 0;
      const nextCount = state.count + amount;
      return {
        count: nextCount,
        history: [...state.history, `+${amount} -> ${nextCount}`],
      };
    }
    case 'RESET':
      return {
        count: 0,
        history: [...state.history, 'reset -> 0'],
      };
    default:
      return state;
  }
}

export default function Exercise1Counter() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [],
  });
  const [amount, setAmount] = useState(10);

  return (
    <div>
      <p>Current count: {state.count}</p>
      <div className="row">
        <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
        <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
        <input
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
        <button
          onClick={() =>
            dispatch({ type: 'INCREMENT_BY', payload: Number(amount) })
          }
        >
          Add amount
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>

      <ul className="list">
        {state.history.map((entry, index) => (
          <li key={`${entry}-${index}`}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
