const STATUS_CONFIG = {
	online: { color: "#22c55e", text: "На линия" },
	away: { color: "#eab308", text: "Отсъства" },
	offline: { color: "#9ca3af", text: "Офлайн" },
};

function StatusBadge({ status, label }) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline;
	// console.log(status)

	return (
		<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
			<span
				style={{
					width: 12,
					height: 12,
					borderRadius: "50%",
					background: config.color,
					display: "inline-block",
				}}
			/>
			<span>
				{label ? `${label} - ${config.text}` : config.text}
			</span>
		</div>
	);
}

export default StatusBadge;
