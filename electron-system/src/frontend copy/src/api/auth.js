import axios from "axios";
import { jwtDecode } from "jwt-decode";

// تنظیمات پایه axios
const api = axios.create({
	baseURL: "http://localhost:5000/api",
	withCredentials: true,
});

// اضافه کردن interceptor برای توکن JWT
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const checkAuth = async () => {
	try {
		// بررسی وجود توکن در localStorage
		const token = localStorage.getItem("token");
		if (!token) {
			throw new Error("No token found");
		}

		// بررسی انقضای توکن
		const decoded = jwtDecode(token);
		if (decoded.exp * 1000 < Date.now()) {
			localStorage.removeItem("token");
			throw new Error("Token expired");
		}

		// اعتبارسنجی توکن با سرور
		const response = await api.get("/auth/me");
		return response.data;
	} catch (error) {
		console.error("Authentication check failed:", error.message);
		localStorage.removeItem("token");
		return null;
	}
};

// سایر توابع مرتبط با احراز هویت
export const login = async (credentials) => {
	const response = await api.post("/auth/login", credentials);
	localStorage.setItem("token", response.data.token);
	return response.data;
};

export const logout = () => {
	localStorage.removeItem("token");
	return api.post("/auth/logout");
};
