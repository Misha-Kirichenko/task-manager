import {
	Box,
	Checkbox,
	FormControl,
	FormControlLabel,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	TextField,
	Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import AuthService from "../../api/authService";
import TextButton from "../../components/TextButton";

const Login = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [loginData, setLoginData] = useState({ login: "", password: "" });

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

	const handleInputChange = useCallback((event) => {
		const { name, value } = event.target;
		setErrorMessage("");
		setLoginData((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleRememberMeChange = useCallback((event) => {
		setRememberMe(event.target.checked);
	}, []);

	const handleLogin = async () => {
		try {
			const { login, password } = loginData;
			if (!login || !password) {
				setErrorMessage("All fields are required");
				return;
			}

			const loggedIn = await AuthService.login(loginData, rememberMe);
			if (loggedIn) navigate("/");
		} catch (err) {
			setErrorMessage(err.response.data.message || "Login failed");
		}
	};

	return (
		<Box sx={{ width: "45%", margin: "auto", height: "50%", mt: "15vh" }}>
			<Typography variant="h4" sx={{ mb: "10%", textAlign: "center" }}>
				Login to Task Manager
			</Typography>

			<Box sx={{ color: "red", height: "20px", mb: "20px" }}>
				{errorMessage}
			</Box>

			<TextField
				label="Login"
				variant="standard"
				fullWidth
				name="login"
				value={loginData.login}
				onChange={handleInputChange}
				sx={{ mb: "20px" }}
			/>

			<FormControl variant="standard" fullWidth sx={{ mb: "20px" }}>
				<InputLabel htmlFor="password">Password</InputLabel>
				<Input
					id="password"
					type={showPassword ? "text" : "password"}
					name="password"
					value={loginData.password}
					onChange={handleInputChange}
					endAdornment={
						<InputAdornment position="end">
							<IconButton onClick={togglePasswordVisibility}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
			</FormControl>

			<Box>
				<FormControlLabel
					control={
						<Checkbox checked={rememberMe} onChange={handleRememberMeChange} />
					}
					label="Remember me"
					sx={{ color: "text.secondary" }}
				/>
			</Box>
			<Box>
				<TextButton text="Login" action={handleLogin} />
			</Box>
		</Box>
	);
};

export default Login;
