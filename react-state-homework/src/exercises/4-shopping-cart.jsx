import { useReducer } from 'react';

const PRODUCTS = [
  { id: 1, name: 'React T-shirt', price: 29.99 },
  { id: 2, name: 'JavaScript Mug', price: 14.99 },
  { id: 3, name: 'CSS Stickers', price: 4.99 },
  { id: 4, name: 'Node.js Hat', price: 24.99 },
];

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id,
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.product.id !== action.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map((item) =>
            item.product.id === action.id
              ? { ...item, quantity: Math.max(0, action.quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

export default function Exercise4ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div>
      <h3>Product catalog</h3>
      <div className="row">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-box">
            <p>{product.name}</p>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={() => dispatch({ type: 'ADD_ITEM', product })}>
              Add
            </button>
          </div>
        ))}
      </div>

      <h3>Cart ({totalItems} items)</h3>
      <ul className="list">
        {cart.items.map((item) => (
          <li key={item.product.id} className="cart-item">
            <span>
              {item.product.name} (${item.product.price.toFixed(2)})
            </span>
            <div className="row">
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_QUANTITY',
                    id: item.product.id,
                    quantity: item.quantity - 1,
                  })
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_QUANTITY',
                    id: item.product.id,
                    quantity: item.quantity + 1,
                  })
                }
              >
                +
              </button>
              <button
                onClick={() =>
                  dispatch({ type: 'REMOVE_ITEM', id: item.product.id })
                }
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p>Total: ${totalPrice.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear cart</button>
    </div>
  );
}
