import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Hello from "views/Hello";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Hello />} />
			</Routes>
		</Router>
	);
}
