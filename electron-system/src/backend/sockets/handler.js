// src/backend/sockets/handler.js
const logger = require("../utils/logger");
const authMiddleware = require("../middleware/socket-auth");
const { handleClientConnection } = require("./client");
const { handleServerConnection } = require("./server");

module.exports = (io) => {
	// فضای نام‌های مختلف برای کلاینت و سرور
	const clientNamespace = io.of("/client");
	const serverNamespace = io.of("/server");

	// اعتبارسنجی اتصال‌های سوکت
	clientNamespace.use(authMiddleware);
	serverNamespace.use(authMiddleware);

	// مدیریت اتصال کلاینت‌ها
	clientNamespace.on("connection", (socket) => {
		handleClientConnection(socket, clientNamespace);
	});

	// مدیریت اتصال سرورها
	serverNamespace.on("connection", (socket) => {
		handleServerConnection(socket, serverNamespace);
	});

	logger.info("Socket handlers initialized");
};
