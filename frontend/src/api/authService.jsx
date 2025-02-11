import axios from "axios";

class AuthService {
	static apibase = `${import.meta.env.VITE_API_URL}/auth`;

	static async login(userData, rememberMe = false) {
		const answer = await axios.post(`${AuthService.apibase}/login`, userData);
		const { accessToken, refreshToken } = answer.data;
		if (rememberMe) {
			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("refreshToken", refreshToken);
		} else {
			sessionStorage.setItem("accessToken", accessToken);
			sessionStorage.setItem("refreshToken", refreshToken);
		}
		return true;
	}
}

export default AuthService;
