import { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext(null);

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.notification];
    case 'REMOVE':
      return state.filter((notification) => notification.id !== action.id);
    case 'CLEAR_ALL':
      return [];
    default:
      return state;
  }
}

function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addNotification = (type, message) => {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
    };

    dispatch({ type: 'ADD', notification });
  };

  const removeNotification = (id) => dispatch({ type: 'REMOVE', id });
  const clearAll = () => dispatch({ type: 'CLEAR_ALL' });

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider');
  }
  return context;
}

function NotificationCount() {
  const { notifications } = useNotifications();
  return <p>Notifications: {notifications.length}</p>;
}

function AddNotificationPanel() {
  const { addNotification } = useNotifications();

  return (
    <div className="row">
      <button
        onClick={() => addNotification('success', 'Operation was successful')}
      >
        Success
      </button>
      <button onClick={() => addNotification('error', 'Something went wrong')}>
        Error
      </button>
      <button onClick={() => addNotification('warning', 'Please be careful')}>
        Warning
      </button>
    </div>
  );
}

function NotificationList() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <ul className="list">
      {notifications.map((notification) => (
        <li key={notification.id} className={`notice ${notification.type}`}>
          <span>{notification.message}</span>
          <button onClick={() => removeNotification(notification.id)}>X</button>
        </li>
      ))}
    </ul>
  );
}

function ClearAllButton() {
  const { clearAll } = useNotifications();
  return <button onClick={clearAll}>Clear all</button>;
}

export default function Exercise3Notifications() {
  return (
    <NotificationProvider>
      <NotificationCount />
      <AddNotificationPanel />
      <NotificationList />
      <ClearAllButton />
    </NotificationProvider>
  );
}
