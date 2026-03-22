import { useState } from "react";

function AccordionItem({ title, isOpen, onToggle, children }) {

	return (
		<div style={{ border: "1px solid #ddd", borderRadius: 6, marginBottom: 4 }}>
			<button
				onClick={onToggle}
				style={{
					width: "100%",
					padding: "10px 14px",
					background: isOpen ? "#f3f4f6" : "#fff",
					border: "none",
					textAlign: "left",
					cursor: "pointer",
					fontWeight: "bold",
					fontSize: 14,
				}}
			>
				{isOpen ? "▾" : "▸"} {title}
			</button>
			{isOpen && <div style={{ padding: "10px 14px" }}>{children}</div>}
		</div>
	);
}

function Accordion({ children }) {
	const [openIndex, setOpenIndex] = useState(null);

	const items = Array.isArray(children) ? children : [children];

	return (
		<div>
			{items.map((child, i) => {
				if (!child) return null;
				return (
					<AccordionItem
						key={i}
						title={child.props.title}
						isOpen={openIndex === i}
						onToggle={() => setOpenIndex(openIndex === i ? null : i)}
					>
						{child.props.children}
					</AccordionItem>
				);
			})}
		</div>
	);
}

function AccordionItemSlot({ title, children }) {
	return null;
}

export { Accordion, AccordionItemSlot as AccordionItem };
