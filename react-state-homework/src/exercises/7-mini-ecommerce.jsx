import { createContext, useContext, useMemo, useReducer, useState } from 'react';
import { create } from 'zustand';

const ThemeContext = createContext(null);
const AuthContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () =>
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email) => {
    const fallback = 'student@example.com';
    const safeEmail = email.trim() || fallback;
    setUser({ email: safeEmail, name: safeEmail.split('@')[0] });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

const useProductStore = create((set) => ({
  products: [
    { id: 1, name: 'React Book', price: 45, category: 'books' },
    { id: 2, name: 'JS T-shirt', price: 30, category: 'clothing' },
    { id: 3, name: 'CSS Stickers', price: 5, category: 'accessories' },
    { id: 4, name: 'Node.js Mug', price: 15, category: 'accessories' },
    { id: 5, name: 'TypeScript Course', price: 99, category: 'courses' },
  ],
  favorites: [],
  searchQuery: '',
  category: 'all',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCategory: (category) => set({ category }),
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((favoriteId) => favoriteId !== id)
        : [...state.favorites, id],
    })),
}));

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(
        (item) => item.product.id === action.product.id,
      );

      if (existing) {
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
    case 'REMOVE_FROM_CART':
      return {
        items: state.items.filter((item) => item.product.id !== action.id),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

function NavBar({ cartItemCount }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="shop-nav">
      <strong>Mini Shop</strong>
      <span>Items in cart: {cartItemCount}</span>
      <span>{user ? `User: ${user.name}` : 'No user'}</span>
      <button onClick={toggleTheme}>Theme: {theme}</button>
    </header>
  );
}

function LoginForm() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');

  if (user) {
    return <button onClick={logout}>Logout</button>;
  }

  return (
    <div className="row">
      <input
        placeholder="email@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button onClick={() => login(email)}>Login</button>
    </div>
  );
}

function SearchBar() {
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);

  return (
    <input
      placeholder="Search products"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
  );
}

function CategoryFilter() {
  const category = useProductStore((state) => state.category);
  const setCategory = useProductStore((state) => state.setCategory);

  return (
    <select value={category} onChange={(event) => setCategory(event.target.value)}>
      <option value="all">All</option>
      <option value="books">Books</option>
      <option value="clothing">Clothing</option>
      <option value="accessories">Accessories</option>
      <option value="courses">Courses</option>
    </select>
  );
}

function ProductGrid({ onAddToCart }) {
  const products = useProductStore((state) => state.products);
  const favorites = useProductStore((state) => state.favorites);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const category = useProductStore((state) => state.category);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    return result;
  }, [products, category, searchQuery]);

  return (
    <div className="grid">
      {filteredProducts.map((product) => {
        const isFavorite = favorites.includes(product.id);

        return (
          <article key={product.id} className="product-box">
            <p>{product.name}</p>
            <p>${product.price}</p>
            <div className="row">
              <button onClick={() => onAddToCart(product)}>Add to cart</button>
              <button onClick={() => toggleFavorite(product.id)}>
                {isFavorite ? 'Unfavorite' : 'Favorite'}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Cart({ items, dispatch }) {
  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  );

  return (
    <div>
      <h4>Cart</h4>
      <ul className="list">
        {items.map((item) => (
          <li key={item.product.id} className="cart-item">
            <span>
              {item.product.name} x {item.quantity}
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
                  dispatch({ type: 'REMOVE_FROM_CART', id: item.product.id })
                }
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear cart</button>
    </div>
  );
}

function FavoritesPanel() {
  const products = useProductStore((state) => state.products);
  const favorites = useProductStore((state) => state.favorites);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.includes(product.id)),
    [products, favorites],
  );

  return (
    <div>
      <h4>Favorites</h4>
      {favoriteProducts.length ? (
        <ul className="list">
          {favoriteProducts.map((product) => (
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      ) : (
        <p>No favorites yet</p>
      )}
    </div>
  );
}

function ShopBody() {
  const { theme } = useTheme();
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const cartItemCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items],
  );

  return (
    <div className={`shop-shell ${theme}`}>
      <NavBar cartItemCount={cartItemCount} />
      <LoginForm />
      <div className="shop-layout">
        <div>
          <SearchBar />
          <CategoryFilter />
          <ProductGrid
            onAddToCart={(product) => dispatch({ type: 'ADD_TO_CART', product })}
          />
        </div>
        <div>
          <Cart items={cart.items} dispatch={dispatch} />
          <FavoritesPanel />
        </div>
      </div>
    </div>
  );
}

export default function Exercise7MiniEcommerce() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ShopBody />
      </AuthProvider>
    </ThemeProvider>
  );
}
