import StudentCard from "./components/StudentCard";
import StatusBadge from "./components/StatusBadge";
import { Accordion, AccordionItem } from "./components/Accordion";
import FilterableStudentList from "./components/FilterableStudentList";
import { Tabs, Tab } from "./components/Tabs";
import Classroom from "./components/Classroom";
import QuizBuilder from "./components/QuizBuilder";


function Section({ title, children }) {
	return (
		<section style={{ marginBottom: 40 }}>
			<h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: 6 }}>{title}</h2>
			{children}
		</section>
	);
}

function App() {
	return (
		<div style={{ maxWidth: 700, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
			<h1>React Props Homework</h1>

			<Section title="1. Визитка на ученик (StudentCard)">
				<StudentCard name="Гошо Пешо" grade="11Б" averageScore={4.2} />
				<StudentCard name="Пешо Гошев" grade="11А" averageScore={4.01} />
				<StudentCard name="Луканчо луканков" grade="11Л" averageScore={6.01} />
			</Section>

			<Section title="2. Статус индикатор (StatusBadge)">
				<StatusBadge status="online" />
				<StatusBadge status="away" />
				<StatusBadge status="offline" />
				<StatusBadge status="online" label="Гошо" />
			</Section>

			<Section title="3. Акордеон (Accordion)">
				<Accordion>
					<AccordionItem title="Какво е луканка?">
						<p>Салам. Много добър.</p>
					</AccordionItem>
					<AccordionItem title="Колко стига?">
						<p>Около 5 минути.</p>
					</AccordionItem>
					<AccordionItem title="Случаен факт">
						<p>Пешо пази последното парче.</p>
					</AccordionItem>
					<AccordionItem title="Луканка вътре в луканка">
						<Accordion>
							<AccordionItem title="Какво е луканка?">
								<p>Салам. Много добър.</p>
							</AccordionItem>
							<AccordionItem title="Колко стига?">
								<p>Около 5 минути.</p>
							</AccordionItem>
							<AccordionItem title="Случаен факт">
								<p>Пешо пази последното парче.</p>
							</AccordionItem>
						</Accordion>
					</AccordionItem>
				</Accordion>
			</Section>

			<Section title="4. Филтрируем списък (FilterableStudentList)">
				<FilterableStudentList />
			</Section>

			<Section title="5. Система от табове (Tabs)">
				<Tabs>
					<Tab label="Гошо">
						<p>Име: Гошо Пешо</p>
						<p>Клас: 11Б</p>
					</Tab>
					<Tab label="Пешо">
						<ul>
							<li>Математика: 3.33</li>
							<li>Луканкознание: 6.00</li>
						</ul>
					</Tab>
					<Tab label="Луканка факти">
						<p>Факт 1: Изчезва бързо.</p>
						<p>Факт 2: С хляб е по-добре.</p>
					</Tab>
				</Tabs>
			</Section>

			<Section title="6. Мини класна стая (Classroom)">
				<Classroom />
			</Section>

			<Section title="7. Конструктор на тестове (QuizBuilder)">
				<QuizBuilder />
			</Section>
		</div>
	);
}

export default App;
