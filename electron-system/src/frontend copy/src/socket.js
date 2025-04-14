// src/frontend/src/socket.js
import { io } from "socket.io-client";
console.log("* * * window.electronAPI : ", window.electronAPI);

const SOCKET_URL = window.electronAPI
	? window.electronAPI.getServerUrl() // از الکترون آدرس سرور را می‌گیریم
	: "http://localhost:5000"; // برای حالت توسعه

export const socket = io(SOCKET_URL, {
	autoConnect: false,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
	auth: {
		token: "YOUR_JWT_TOKEN", // توکن دریافتی از لاگین
	},
});
