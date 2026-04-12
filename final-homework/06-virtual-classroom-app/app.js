const { createContext, useContext, useEffect, useReducer, useState } = React;
const html = htm.bind(React.createElement);

const STORAGE_KEY = "task-06-classroom";
const ClassroomContext = createContext(null);

const seedStudents = [
  { id: 1, name: "Иван Петров", class: "11А", grades: { "Математика": [5, 6, 4], "Информатика": [6, 5], "Физика": [5] } },
  { id: 2, name: "Мария Иванова", class: "11Б", grades: { "Математика": [6, 6], "Информатика": [5, 6], "Физика": [5, 4] } },
  { id: 3, name: "Георги Стоянов", class: "11А", grades: { "Математика": [4, 5], "Информатика": [5, 5, 6], "Български": [4] } },
  { id: 4, name: "Никол Димитрова", class: "11Б", grades: { "Математика": [6, 5, 6], "Информатика": [6], "Английски": [6, 5] } },
  { id: 5, name: "Петър Георгиев", class: "11А", grades: { "Математика": [3, 4], "Информатика": [4, 5], "Физика": [3] } },
  { id: 6, name: "Елена Костова", class: "11Б", grades: { "Математика": [5, 5], "Информатика": [6, 6], "Български": [5] } },
  { id: 7, name: "Даниел Тодоров", class: "11А", grades: { "Математика": [2, 3], "Информатика": [4], "Физика": [3, 2] } },
  { id: 8, name: "София Илиева", class: "11Б", grades: { "Математика": [6, 6, 5], "Информатика": [6, 6], "Английски": [6] } },
  { id: 9, name: "Алекс Христов", class: "11А", grades: { "Математика": [5, 4, 5], "Информатика": [5, 4], "Български": [5] } },
  { id: 10, name: "Виктория Маринова", class: "11Б", grades: { "Математика": [4, 5], "Информатика": [5, 5], "Физика": [4, 4] } },
];

const subjects = ["Математика", "Информатика", "Физика", "Български", "Английски"];

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
  }

  return {
    students: seedStudents,
    classFilter: "all",
    searchQuery: "",
    nextId: 11,
  };
}

function classroomReducer(state, action) {
  switch (action.type) {
    case "ADD_STUDENT":
      return {
        ...state,
        nextId: state.nextId + 1,
        students: [
          ...state.students,
          { id: state.nextId, name: action.name, class: action.className, grades: {} },
        ],
      };
    case "ADD_GRADE":
      return {
        ...state,
        students: state.students.map((student) =>
          student.id === action.studentId
            ? {
                ...student,
                grades: {
                  ...student.grades,
                  [action.subject]: [...(student.grades[action.subject] || []), action.grade],
                },
              }
            : student,
        ),
      };
    case "REMOVE_STUDENT":
      return {
        ...state,
        students: state.students.filter((student) => student.id !== action.id),
      };
    case "SET_FILTER":
      return {
        ...state,
        classFilter: action.classFilter ?? state.classFilter,
        searchQuery: action.searchQuery ?? state.searchQuery,
      };
    default:
      return state;
  }
}

function getStudentAverage(student) {
  const allGrades = Object.values(student.grades).flat();
  if (allGrades.length === 0) return 0;
  return allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
}

function ClassroomProvider({ children }) {
  const [state, dispatch] = useReducer(classroomReducer, null, getInitialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, ready]);

  return html`<${ClassroomContext.Provider} value=${{ ...state, dispatch, ready }}>${children}</${ClassroomContext.Provider}>`;
}

function useClassroom() {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error("useClassroom must be inside Provider");
  }
  return context;
}

function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("task-06-dark") === "true";
    } catch (error) {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    try {
      localStorage.setItem("task-06-dark", String(dark));
    } catch (error) {
    }
  }, [dark]);

  return html`<button className="mode-btn" type="button" onClick=${() => setDark((current) => !current)}>${dark ? "Light Mode" : "Dark Mode"}</button>`;
}

function SearchBar() {
  const { searchQuery, dispatch } = useClassroom();

  return html`
    <section className="panel">
      <span className="panel-title">Търсене</span>
      <input
        value=${searchQuery}
        onChange=${(event) => dispatch({ type: "SET_FILTER", searchQuery: event.target.value })}
        placeholder="Търси по име"
      />
    </section>
  `;
}

function ClassFilter() {
  const { classFilter, dispatch } = useClassroom();

  return html`
    <section className="panel">
      <span className="panel-title">Филтър по клас</span>
      <div className="filter-row">
        <select value=${classFilter} onChange=${(event) => dispatch({ type: "SET_FILTER", classFilter: event.target.value })}>
          <option value="all">Всички класове</option>
          <option value="11А">11А</option>
          <option value="11Б">11Б</option>
        </select>
      </div>
    </section>
  `;
}

function StudentForm() {
  const { dispatch } = useClassroom();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("11А");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Името е задължително.");
      return;
    }

    dispatch({ type: "ADD_STUDENT", name: trimmed, className });
    setName("");
    setClassName("11А");
    setError("");
  }

  return html`
    <section className="panel">
      <span className="panel-title">Нов ученик</span>
      <form onSubmit=${handleSubmit}>
        <div className="form-row">
          <input value=${name} onChange=${(event) => setName(event.target.value)} placeholder="Име на ученик" />
          <select value=${className} onChange=${(event) => setClassName(event.target.value)}>
            <option value="11А">11А</option>
            <option value="11Б">11Б</option>
          </select>
          <button className="primary-btn" type="submit">Добави ученик</button>
        </div>
      </form>
      <p className="error-text">${error}</p>
    </section>
  `;
}

function GradeForm() {
  const { students, dispatch } = useClassroom();
  const [studentId, setStudentId] = useState(students[0]?.id || 0);
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState("6");

  useEffect(() => {
    if (!students.some((student) => student.id === Number(studentId)) && students[0]) {
      setStudentId(students[0].id);
    }
  }, [students, studentId]);

  function handleSubmit(event) {
    event.preventDefault();
    const numericGrade = Number(grade);
    if (studentId && numericGrade >= 2 && numericGrade <= 6) {
      dispatch({ type: "ADD_GRADE", studentId: Number(studentId), subject, grade: numericGrade });
      setGrade("6");
    }
  }

  return html`
    <section className="panel">
      <span className="panel-title">Добави оценка</span>
      <form onSubmit=${handleSubmit}>
        <div className="form-row">
          <select value=${studentId} onChange=${(event) => setStudentId(Number(event.target.value))}>
            ${students.map((student) => html`<option key=${student.id} value=${student.id}>${student.name}</option>`) }
          </select>
          <select value=${subject} onChange=${(event) => setSubject(event.target.value)}>
            ${subjects.map((item) => html`<option key=${item} value=${item}>${item}</option>`) }
          </select>
          <input type="number" min="2" max="6" value=${grade} onChange=${(event) => setGrade(event.target.value)} />
          <button className="primary-btn" type="submit">Добави оценка</button>
        </div>
      </form>
    </section>
  `;
}

function StatsDashboard() {
  const { students, classFilter, searchQuery } = useClassroom();

  const filtered = students
    .filter((student) => classFilter === "all" || student.class === classFilter)
    .filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const withAverages = filtered.map((student) => ({ ...student, average: getStudentAverage(student) }));
  const overallAverage = withAverages.length > 0
    ? withAverages.reduce((sum, student) => sum + student.average, 0) / withAverages.length
    : 0;

  const bestStudent = withAverages.slice().sort((a, b) => b.average - a.average)[0];
  const honorsCount = withAverages.filter((student) => student.average >= 5.5).length;

  const avgByClass = (className) => {
    const classStudents = students.filter((student) => student.class === className);
    if (classStudents.length === 0) return 0;
    return classStudents.reduce((sum, student) => sum + getStudentAverage(student), 0) / classStudents.length;
  };

  return html`
    <section className="stats-grid">
      <article>
        <span>Общ среден успех</span>
        <strong>${overallAverage.toFixed(2)}</strong>
      </article>
      <article>
        <span>Най-добър ученик</span>
        <strong>${bestStudent ? bestStudent.name : "Няма"}</strong>
      </article>
      <article>
        <span>11А vs 11Б</span>
        <strong>${avgByClass("11А").toFixed(2)} / ${avgByClass("11Б").toFixed(2)}</strong>
      </article>
      <article>
        <span>Брой отличници</span>
        <strong>${honorsCount}</strong>
      </article>
    </section>
  `;
}

function StudentTable() {
  const { students, classFilter, searchQuery, dispatch } = useClassroom();

  const filteredStudents = students
    .filter((student) => classFilter === "all" || student.class === classFilter)
    .filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .map((student) => ({ ...student, average: getStudentAverage(student) }))
    .sort((a, b) => b.average - a.average);

  const renderAverage = (value) => {
    const className = value >= 5.5 ? "high" : value <= 3 ? "low" : "";
    return html`<span className=${`avg-chip ${className ? `grade-value ${className}` : ""}`}>${value.toFixed(2)}</span>`;
  };

  return html`
    <div>
      <section className="desktop-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Ученик</th>
              <th>Клас</th>
              <th>Предмети</th>
              <th>Среден успех</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            ${filteredStudents.map((student) => html`
              <tr key=${student.id}>
                <td className="student-name">${student.name}</td>
                <td>${student.class}</td>
                <td>${Object.entries(student.grades).map(([subject, grades]) => `${subject}: ${grades.join(", ")}`).join(" • ") || "Няма оценки"}</td>
                <td>${renderAverage(student.average)}</td>
                <td><button className="danger-btn" type="button" onClick=${() => dispatch({ type: "REMOVE_STUDENT", id: student.id })}>Премахни</button></td>
              </tr>
            `)}
          </tbody>
        </table>
      </section>

      <section className="mobile-cards">
        <div className="mobile-cards-list">
          ${filteredStudents.map((student) => html`
            <article className="mobile-card" key=${student.id}>
              <h3>${student.name}</h3>
              <div className="mobile-meta">
                <span className="class-chip">${student.class}</span>
                ${renderAverage(student.average)}
              </div>
              <div className="mobile-subjects">
                ${Object.entries(student.grades).length > 0
                  ? Object.entries(student.grades).map(([subject, grades]) => html`<span key=${subject} className="subject-chip">${subject}: ${grades.join(", ")}</span>`)
                  : html`<span className="subject-chip">Няма оценки</span>`}
              </div>
              <div className="mobile-meta">
                <button className="danger-btn" type="button" onClick=${() => dispatch({ type: "REMOVE_STUDENT", id: student.id })}>Премахни</button>
              </div>
            </article>
          `)}
        </div>
      </section>
    </div>
  `;
}

function ClassroomBody() {
  const { ready } = useClassroom();

  if (!ready) {
    return html`
      <section className="loading-card">
        <h2>Зарежда се...</h2>
        <p>Подготвяме данните за виртуалната класна стая.</p>
      </section>
    `;
  }

  return html`
    <main className="classroom-shell">
      <div className="topbar">
        <${DarkModeToggle} />
      </div>
      <section className="hero">
        <div>
          <p className="eyebrow">Задача 6</p>
          <h1>Виртуална класна стая</h1>
          <p>Responsive приложение с localStorage, reducer, търсене, филтри и статистика.</p>
        </div>
      </section>
      <${StatsDashboard} />
      <section className="control-grid">
        <${SearchBar} />
        <${ClassFilter} />
        <${StudentForm} />
      </section>
      <section className="control-grid">
        <${GradeForm} />
      </section>
      <${StudentTable} />
    </main>
  `;
}

function App() {
  return html`
    <${ClassroomProvider}>
      <${ClassroomBody} />
    </${ClassroomProvider}>
  `;
}

ReactDOM.createRoot(document.querySelector("#app")).render(html`<${App} />`);
