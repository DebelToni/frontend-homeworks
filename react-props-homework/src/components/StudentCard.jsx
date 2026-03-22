function StudentCard({ name, grade, averageScore }) {

	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("");

	return (
		<div style={styles.card}>
			<div style={styles.row}>
				<div style={styles.circle}>{initials}</div>
				<div>
					<div style={styles.name}>{name}</div>
					<div style={styles.info}>
						Клас: {grade} | Успех: {averageScore}
					</div>
				</div>
			</div>
		</div>
	);
}

const styles = {
	card: {
		border: "1px solid #ddd",
		borderRadius: 8,
		padding: 16,
		maxWidth: 300,
		marginBottom: 12,
	},
	row: { display: "flex", alignItems: "center", gap: 12 },
	circle: {
		width: 48,
		height: 48,
		borderRadius: "50%",
		background: "#4f46e5",
		color: "#fff",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: "bold",
		fontSize: 18,
		flexShrink: 0,
	},
	name: { fontWeight: "bold", fontSize: 16 },
	info: { color: "#666", fontSize: 14 },
};

export default StudentCard;
