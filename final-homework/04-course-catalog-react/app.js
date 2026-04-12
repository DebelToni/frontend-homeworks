const { useState } = React;
const html = htm.bind(React.createElement);

const courses = [
  { id: 1, title: "React Основи", category: "Frontend", level: "Начинаещ", rating: 4.8, students: 1200 },
  { id: 2, title: "Node.js API", category: "Backend", level: "Среден", rating: 4.5, students: 800 },
  { id: 3, title: "Docker и Kubernetes", category: "DevOps", level: "Напреднал", rating: 4.9, students: 450 },
  { id: 4, title: "TypeScript за Frontend", category: "Frontend", level: "Среден", rating: 4.7, students: 930 },
  { id: 5, title: "Express Архитектура", category: "Backend", level: "Напреднал", rating: 4.6, students: 560 },
  { id: 6, title: "CI/CD Практики", category: "DevOps", level: "Среден", rating: 4.4, students: 390 },
  { id: 7, title: "HTML и CSS Старт", category: "Frontend", level: "Начинаещ", rating: 4.3, students: 1500 },
  { id: 8, title: "SQL и Бази данни", category: "Backend", level: "Начинаещ", rating: 4.2, students: 710 },
  { id: 9, title: "Linux Automation", category: "DevOps", level: "Напреднал", rating: 4.8, students: 520 },
];

function SearchBar({ value, onChange }) {
  return html`
    <div className="control-card">
      <label className="control-label" htmlFor="search-course">Търсене по заглавие</label>
      <input
        id="search-course"
        value=${value}
        onChange=${(event) => onChange(event.target.value)}
        placeholder="Търси курс..."
      />
    </div>
  `;
}

function FilterPanel({ category, level, onCategoryChange, onLevelChange, onClear }) {
  return html`
    <div className="control-card">
      <span className="control-label">Филтри</span>
      <div className="filter-grid">
        <select value=${category} onChange=${(event) => onCategoryChange(event.target.value)}>
          <option value="all">Всички категории</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
        </select>
        <select value=${level} onChange=${(event) => onLevelChange(event.target.value)}>
          <option value="all">Всички нива</option>
          <option value="Начинаещ">Начинаещ</option>
          <option value="Среден">Среден</option>
          <option value="Напреднал">Напреднал</option>
        </select>
        <button className="clear-btn" type="button" onClick=${onClear}>Изчисти филтрите</button>
      </div>
    </div>
  `;
}

function SortControls({ sortBy, onChange }) {
  return html`
    <div className="control-card sort-card">
      <button
        className=${`sort-btn ${sortBy === "rating" ? "active" : ""}`}
        type="button"
        onClick=${() => onChange("rating")}
      >
        Сортирай по rating
      </button>
      <button
        className=${`sort-btn ${sortBy === "students" ? "active" : ""}`}
        type="button"
        onClick=${() => onChange("students")}
      >
        Сортирай по students
      </button>
    </div>
  `;
}

function CourseCard({ course }) {
  const levelClass = {
    "Начинаещ": "beginner",
    "Среден": "intermediate",
    "Напреднал": "advanced",
  }[course.level];

  return html`
    <article className="course-card">
      <div className="card-top">
        <div>
          <h3>${course.title}</h3>
          <div className="course-meta">
            <span className=${`badge ${levelClass}`}>${course.level}</span>
            <span className="category-pill">${course.category}</span>
            ${course.rating >= 4.5 && html`<span className="top-rated">Top Rated</span>`}
          </div>
        </div>
        ${course.rating && html`<div className="stars">${"★".repeat(Math.round(course.rating))}</div>`}
      </div>
      <div className="course-footer">
        <span>Рейтинг: ${course.rating.toFixed(1)}</span>
        <span>${course.students.toLocaleString("bg-BG")} студенти</span>
      </div>
    </article>
  `;
}

function CourseList({ courses: items }) {
  if (items.length === 0) {
    return html`<div className="empty-state">Няма намерени курсове</div>`;
  }

  return html`
    <div className="course-grid">
      ${items.map((course) => html`<${CourseCard} key=${course.id} course=${course} />`)}
    </div>
  `;
}

function StatsBar({ children }) {
  return html`<div className="stats-bar">${children}</div>`;
}

function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = courses
    .filter((course) => course.title.toLowerCase().includes(search.toLowerCase()))
    .filter((course) => category === "all" || course.category === category)
    .filter((course) => level === "all" || course.level === level)
    .slice()
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const avgRating = filtered.length > 0
    ? filtered.reduce((sum, course) => sum + course.rating, 0) / filtered.length
    : 0;

  const totalStudents = filtered.reduce((sum, course) => sum + course.students, 0);

  return html`
    <main className="catalog-shell">
      <section className="hero">
        <p className="eyebrow">Задача 4</p>
        <h1>Филтрируем каталог с компоненти</h1>
        <p>Търсене, филтри и сортиране в минимален React интерфейс.</p>
      </section>

      <section className="controls-grid">
        <${SearchBar} value=${search} onChange=${setSearch} />
        <${FilterPanel}
          category=${category}
          level=${level}
          onCategoryChange=${setCategory}
          onLevelChange=${setLevel}
          onClear=${() => {
            setCategory("all");
            setLevel("all");
            setSearch("");
          }}
        />
        <${SortControls} sortBy=${sortBy} onChange=${setSortBy} />
      </section>

      <${StatsBar}>
        <span className="stat-chip">Курсове: ${filtered.length}</span>
        <span className="stat-chip">Среден рейтинг: ${avgRating.toFixed(1)}</span>
        <span className="stat-chip">Общо студенти: ${totalStudents.toLocaleString("bg-BG")}</span>
      </${StatsBar}>

      <${CourseList} courses=${filtered} />
    </main>
  `;
}

ReactDOM.createRoot(document.querySelector("#app")).render(html`<${CourseCatalog} />`);
