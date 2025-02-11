import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "../../pages/Login";
import WithAuth from "../HOC/WithAuth";
import "./App.css";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route
					index
					path="/"
					element={
						<WithAuth>
							<div>OK</div>
						</WithAuth>
					}
				/>
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	);
};

export default App;
