import { useState } from "react";

function SearchInput({ value, onChange }) {

	return (
		<input
			type="text"
			placeholder="Търси ученик..."
			value={value}
			onChange={(e) => onChange(e.target.value)}
			style={{ padding: "8px 12px", marginBottom: 12, width: "100%", boxSizing: "border-box" }}
		/>
	);
}

function StudentItem({ student }) {
	return (
		<div style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
			<strong>{student.name}</strong> — {student.grade}
		</div>
	);
}

function FilterableStudentList() {
	const [query, setQuery] = useState("");

	const students = [
		{ id: 1, name: "Гошо Пешо", grade: "11А" },
		{ id: 2, name: "Пешо Гошев", grade: "11Б" },
		{ id: 3, name: "Гошо Луканков", grade: "11А" },
		{ id: 4, name: "Пешо Пешев", grade: "11В" },
		{ id: 5, name: "Гошо", grade: "11Б" },
	];

	const filtered = students.filter((s) =>
		s.name.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<div>
			<SearchInput value={query} onChange={setQuery} />
			{filtered.length === 0 ? (
				<p>Няма намерени ученици</p>
			) : (
				filtered.map((s) => <StudentItem key={s.id} student={s} />)
			)}
		</div>
	);
}

export default FilterableStudentList;
