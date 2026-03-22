import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const AuthContext = createContext(null);
const LangContext = createContext(null);

const translations = {
  bg: {
    dashboard: 'Tablo',
    quizzes: 'Testove',
    settings: 'Nastroiki',
    welcome: 'Dobre doshli',
    login: 'Vhod',
    logout: 'Izhod',
    notLogged: 'Ne ste vlezli',
  },
  en: {
    dashboard: 'Dashboard',
    quizzes: 'Quizzes',
    settings: 'Settings',
    welcome: 'Welcome',
    login: 'Login',
    logout: 'Logout',
    notLogged: 'You are not logged in',
  },
};

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

  const login = (name) => setUser({ name, role: 'student' });
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function LangProvider({ children }) {
  const [lang, setLang] = useState('bg');
  const t = (key) => translations[lang][key] || key;
  const toggleLang = () =>
    setLang((currentLang) => (currentLang === 'bg' ? 'en' : 'bg'));

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
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

function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used inside LangProvider');
  }
  return context;
}

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { lang, toggleLang } = useLang();

  return (
    <header className="dashboard-header">
      <span>User: {user ? user.name : 'Guest'}</span>
      <div className="row">
        <button onClick={toggleTheme}>Theme: {theme}</button>
        <button onClick={toggleLang}>Lang: {lang.toUpperCase()}</button>
        {user && <button onClick={logout}>Logout</button>}
      </div>
    </header>
  );
}

function Sidebar() {
  const { t } = useLang();

  return (
    <aside className="dashboard-sidebar">
      <p>{t('dashboard')}</p>
      <p>{t('quizzes')}</p>
      <p>{t('settings')}</p>
    </aside>
  );
}

function MainContent() {
  const { user, login } = useAuth();
  const { t } = useLang();
  const [name, setName] = useState('');

  if (!user) {
    return (
      <main className="dashboard-main">
        <p>{t('notLogged')}</p>
        <div className="row">
          <input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button onClick={() => login(name || 'Student')}>{t('login')}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main">
      <h3>
        {t('welcome')}, {user.name}
      </h3>
      <p>{t('dashboard')}</p>
    </main>
  );
}

function DashboardBody() {
  const { theme } = useTheme();

  return (
    <div className={`dashboard-shell ${theme}`}>
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default function Exercise5MultiContextDashboard() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LangProvider>
          <DashboardBody />
        </LangProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
