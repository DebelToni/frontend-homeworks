import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

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

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`ex2-box ${theme}`}>
      <strong>Header ({theme})</strong>
      <button onClick={toggleTheme}>Toggle theme</button>
    </header>
  );
}

function QuizCard({ title, questions }) {
  const { theme } = useTheme();

  return (
    <article className={`ex2-card ${theme}`}>
      <h3>{title}</h3>
      <p>Questions: {questions}</p>
    </article>
  );
}

function Footer() {
  const { theme } = useTheme();

  return <footer className={`ex2-box ${theme}`}>Footer ({theme})</footer>;
}

export default function Exercise2ThemeContext() {
  return (
    <ThemeProvider>
      <Header />
      <div className="row">
        <QuizCard title="HTML" questions={32} />
        <QuizCard title="CSS" questions={32} />
      </div>
      <Footer />
    </ThemeProvider>
  );
}
