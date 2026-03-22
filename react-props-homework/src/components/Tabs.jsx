import { useState, Children } from "react";

function Tab({ label, children }) {
	return null;
}

function Tabs({ children }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const tabs = Children.toArray(children);

	return (
		<div>
			<div style={{ display: "flex", gap: 0, borderBottom: "2px solid #ddd" }}>
				{tabs.map((tab, i) => (
					<button
						key={i}
						onClick={() => setActiveIndex(i)}
						style={{
							padding: "8px 16px",
							border: "none",
							borderBottom: activeIndex === i ? "2px solid #4f46e5" : "2px solid transparent",
							background: "none",
							cursor: "pointer",
							fontWeight: activeIndex === i ? "bold" : "normal",
							color: activeIndex === i ? "#4f46e5" : "#666",
							marginBottom: -2,
						}}
					>
						{tab.props.label}

					</button>
				))}
			</div>
			<div style={{ padding: "12px 0" }}>
				{tabs[activeIndex] && tabs[activeIndex].props.children}
			</div>
		</div>
	);
}

export { Tabs, Tab };
