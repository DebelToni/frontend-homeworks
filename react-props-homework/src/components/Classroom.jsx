import { useState } from "react";

function AddStudentForm({ onAdd }) {

	const [name, setName] = useState("");
	const [grade, setGrade] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim() || !grade.trim()) return;
		onAdd({ name: name.trim(), grade: grade.trim() });
		setName("");
		setGrade("");
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
			<input
				placeholder="Име"
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{ padding: 6 }}
			/>
			<input
				placeholder="Клас"
				value={grade}
				onChange={(e) => setGrade(e.target.value)}
				style={{ padding: 6, width: 60 }}
			/>
			<button type="submit">Добави</button>
		</form>
	);
}

function StudentRow({ student, onGrade, onDelete }) {
	const [gradeInput, setGradeInput] = useState("");
	const [gradeError, setGradeError] = useState("");
	const avg =
		student.scores.length > 0
			? (student.scores.reduce((a, b) => a + b, 0) / student.scores.length).toFixed(2)
			: "—";

	const handleGrade = () => {
		if (!gradeInput.trim()) {
			setGradeError("Въведи оценка от 2 до 6");
			return;
		}

		const val = parseFloat(gradeInput);
		if (Number.isNaN(val) || val < 2 || val > 6) {
			setGradeError("Невалидна оценка (2-6)");
			return;
		}

		onGrade(student.id, val);
		setGradeInput("");
		setGradeError("");
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 8,
				padding: "8px 0",
				borderBottom: "1px solid #eee",
				flexWrap: "wrap",
			}}
		>
			<strong>{student.name}</strong>
			<span style={{ color: "#666" }}>({student.grade})</span>
			<span>Среден: {avg}</span>
			<span style={{ color: "#888", fontSize: 12 }}>
				[{student.scores.join(", ")}]
			</span>
			<input
				type="number"
				min="2"
				max="6"
				step="0.01"
				placeholder="Оценка"
				value={gradeInput}
				onChange={(e) => {
					setGradeInput(e.target.value);
					if (gradeError) setGradeError("");
				}}
				style={{ width: 70, padding: 4 }}
			/>
			<button onClick={handleGrade}>Постави</button>
			<button onClick={() => onDelete(student.id)} style={{ color: "red" }}>
				Изтрий
			</button>
			{gradeError && <span style={{ color: "#dc2626", fontSize: 12 }}>{gradeError}</span>}
		</div>
	);
}

function ClassStats({ students }) {
	const allScores = students.flatMap((s) => s.scores);
	const avg =
		allScores.length > 0
			? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
			: "—";
	const max = allScores.length > 0 ? Math.max(...allScores) : "—";
	const min = allScores.length > 0 ? Math.min(...allScores) : "—";

	return (
		<div
			style={{
				marginTop: 16,
				padding: 12,
				background: "#f9fafb",
				borderRadius: 6,
			}}
		>
			<strong>Статистики:</strong> Ученици: {students.length} | Среден успех:{" "}
			{avg} | Най-висока: {max} | Най-ниска: {min}
		</div>
	);
}

function Classroom() {
	const [students, setStudents] = useState([]);
	const addStudent = ({ name, grade }) => {
		setStudents((prev) => [
			...prev,
			{ id: prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1, name, grade, scores: [] },
		]);
	};

	const gradeStudent = (id, score) => {
		setStudents((prev) =>
			prev.map((s) => (s.id === id ? { ...s, scores: [...s.scores, score] } : s))
		);
	};

	const deleteStudent = (id) => {
		setStudents((prev) => prev.filter((s) => s.id !== id));
	};

	return (
		<div>
			<AddStudentForm onAdd={addStudent} />
			{students.map((s) => (
				<StudentRow key={s.id} student={s} onGrade={gradeStudent} onDelete={deleteStudent} />
			))}
			<ClassStats students={students} />
		</div>
	);
}

export default Classroom;
