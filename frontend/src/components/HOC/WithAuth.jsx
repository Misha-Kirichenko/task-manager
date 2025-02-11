import PropTypes from "prop-types";
import { Navigate } from "react-router";

const WithAuth = ({ children }) => {
	const token =
		localStorage.getItem("accessToken") ||
		sessionStorage.getItem("accessToken");
	if (!token) return <Navigate to="/login" />;
	return <>{children}</>;
};

WithAuth.propTypes = {
	children: PropTypes.node.isRequired
};

export default WithAuth;
