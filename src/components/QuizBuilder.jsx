import { useState } from "react";

let _qid = 0;
const newId = () => ++_qid;

function QuizHeader({ title, onChange, isPreview }) {
	if (isPreview) return <h3>{title}</h3>;
	return (
		<input
			value={title}
			onChange={(e) => onChange(e.target.value)}
			style={{ fontSize: 18, fontWeight: "bold", padding: 6, width: "100%", marginBottom: 12, boxSizing: "border-box" }}
		/>
	);
}

function QuestionEditor({ question, onUpdate, onDelete }) {
	const update = (patch) => onUpdate(question.id, { ...question, ...patch });

	const updateOption = (idx, text) => {
		const opts = [...question.options];
		opts[idx] = { ...opts[idx], text };
		update({ options: opts });
	};

	const toggleCorrect = (idx) => {
		const opts = [...question.options];
		opts[idx] = { ...opts[idx], correct: !opts[idx].correct };
		update({ options: opts });
	};

	const removeOption = (idx) => {
		update({ options: question.options.filter((_, i) => i !== idx) });
	};

	const addOption = () => {
		if (question.options.length >= 6) return;
		update({ options: [...question.options, { text: "", correct: false }] });
	};

	return (
		<div style={{ border: "1px solid #ddd", borderRadius: 6, padding: 12, marginBottom: 12 }}>
			<div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
				<input
					placeholder="Текст на въпроса"
					value={question.text}
					onChange={(e) => update({ text: e.target.value })}
					style={{ flex: 1, padding: 6 }}
				/>
				<button onClick={() => onDelete(question.id)} style={{ color: "red" }}>
					Изтрий
				</button>
			</div>
			{question.options.map((opt, i) => (
				<div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
					<input
						type="checkbox"
						checked={opt.correct}
						onChange={() => toggleCorrect(i)}
						title="Правилен отговор"
					/>
					<input
						value={opt.text}
						onChange={(e) => updateOption(i, e.target.value)}
						placeholder={`Отговор ${i + 1}`}
						style={{ flex: 1, padding: 4 }}
					/>
					<button onClick={() => removeOption(i)} style={{ fontSize: 12 }}>
						✕
					</button>
				</div>
			))}
			{question.options.length < 6 && (
				<button onClick={addOption} style={{ fontSize: 12, marginTop: 4 }}>
					+ Добави отговор
				</button>
			)}
		</div>
	);
}

function QuestionPreview({ question }) {
	return (
		<div style={{ marginBottom: 16 }}>
			<p style={{ fontWeight: "bold" }}>{question.text || "(Без текст)"}</p>
			{question.options.map((opt, i) => (
				<label key={i} style={{ display: "block", marginLeft: 12 }}>
					<input type="checkbox" disabled /> {opt.text || "(празен отговор)"}
				</label>
			))}
		</div>
	);
}

function QuizStats({ questions }) {
	const totalOptions = questions.reduce((sum, q) => sum + q.options.length, 0);
	const noCorrect = questions.filter(
		(q) => q.options.length > 0 && !q.options.some((o) => o.correct)
	).length;

	return (
		<div style={{ marginTop: 16, padding: 12, background: "#f9fafb", borderRadius: 6, fontSize: 14 }}>
			<strong>Статистики:</strong> Въпроси: {questions.length} | Общо отговори:{" "}
			{totalOptions} | Без правилен отговор: {noCorrect}
		</div>
	);
}

function QuizBuilder() {
	const [mode, setMode] = useState("edit");
	const [title, setTitle] = useState("Кратък тест за луканка");
	const [questions, setQuestions] = useState([]);

	const addQuestion = () => {
		setQuestions((prev) => [
			...prev,
			{ id: newId(), text: "", options: [{ text: "", correct: false }] },
		]);
	};

	const updateQuestion = (id, updated) => {
		setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
	};

	const deleteQuestion = (id) => {
		setQuestions((prev) => prev.filter((q) => q.id !== id));
	};

	return (
		<div>
			<button
				onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
				style={{ marginBottom: 12 }}
			>
				{mode === "edit" ? "Преглед" : "Редактиране"}
			</button>

			<QuizHeader title={title} onChange={setTitle} isPreview={mode === "preview"} />

			{questions.map((q) =>
				mode === "edit" ? (
					<QuestionEditor
						key={q.id}
						question={q}
						onUpdate={updateQuestion}
						onDelete={deleteQuestion}
					/>
				) : (
					<QuestionPreview key={q.id} question={q} />
				)
			)}

			{mode === "edit" && (
				<button onClick={addQuestion}>+ Нов въпрос</button>
			)}

			<QuizStats questions={questions} />
		</div>
	);
}

export default QuizBuilder;
